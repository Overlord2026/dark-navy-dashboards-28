import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherRequest {
  locations: Array<{ state: string; zip_code?: string }>;
  provider?: 'openweather' | 'tomorrow' | 'accuweather';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { locations, provider = 'openweather' }: WeatherRequest = await req.json();
    
    if (!locations || locations.length === 0) {
      throw new Error('Locations are required');
    }

    let alerts: any[] = [];
    
    switch (provider) {
      case 'openweather':
        alerts = await fetchOpenWeatherAlerts(locations);
        break;
      case 'tomorrow':
        alerts = await fetchTomorrowAlerts(locations);
        break;
      case 'accuweather':
        alerts = await fetchAccuWeatherAlerts(locations);
        break;
      default:
        throw new Error(`Unsupported weather provider: ${provider}`);
    }

    return new Response(JSON.stringify(alerts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in weather-alerts function:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to fetch weather alerts'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

async function fetchOpenWeatherAlerts(locations: Array<{ state: string; zip_code?: string }>): Promise<any[]> {
  const apiKey = Deno.env.get('WEATHER_API_KEY');
  if (!apiKey) {
    throw new Error('OpenWeather API key not configured');
  }

  const alerts = [];
  
  for (const location of locations) {
    try {
      const query = location.zip_code ? `${location.zip_code},US` : `${location.state},US`;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) continue;

      const data = await response.json();
      
      // Check for severe weather conditions
      const weather = data.weather[0];
      const wind = data.wind?.speed || 0;
      
      if (weather.id >= 200 && weather.id < 300) { // Thunderstorm
        alerts.push(createAlert('storm', weather, data, location));
      } else if (weather.id >= 500 && weather.id < 600 && wind > 25) { // Rain + High wind
        alerts.push(createAlert('storm', weather, data, location));
      } else if (wind > 39) { // High wind warning
        alerts.push(createAlert('wind', weather, data, location));
      }
    } catch (error) {
      console.error(`Failed to fetch weather for ${location.state}:`, error);
    }
  }

  return alerts;
}

async function fetchTomorrowAlerts(locations: Array<{ state: string; zip_code?: string }>): Promise<any[]> {
  const apiKey = Deno.env.get('WEATHER_API_KEY');
  if (!apiKey) {
    throw new Error('Tomorrow.io API key not configured');
  }

  // Implementation for Tomorrow.io would go here
  // For now, return empty array
  return [];
}

async function fetchAccuWeatherAlerts(locations: Array<{ state: string; zip_code?: string }>): Promise<any[]> {
  const apiKey = Deno.env.get('WEATHER_API_KEY');
  if (!apiKey) {
    throw new Error('AccuWeather API key not configured');
  }

  // Implementation for AccuWeather would go here
  // For now, return empty array
  return [];
}

function createAlert(type: string, weather: any, data: any, location: any) {
  const severity = determineAlertSeverity(type, weather, data);
  const insuranceImpact = assessInsuranceImpact(type, severity, data);

  return {
    id: `${type}_${location.state}_${Date.now()}`,
    alert_type: type,
    severity,
    location,
    title: `${severity.toUpperCase()} ${type.toUpperCase()} Alert`,
    description: `${weather.description} - Wind: ${data.wind?.speed || 0} mph`,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
    insurance_impact: insuranceImpact,
    created_at: new Date().toISOString()
  };
}

function determineAlertSeverity(type: string, weather: any, data: any): string {
  const wind = data.wind?.speed || 0;
  
  if (type === 'storm') {
    if (wind > 58) return 'extreme'; // Hurricane force
    if (wind > 39) return 'severe'; // Tropical storm force
    if (wind > 25) return 'moderate';
    return 'minor';
  }
  
  if (type === 'wind') {
    if (wind > 74) return 'extreme';
    if (wind > 58) return 'severe';
    if (wind > 39) return 'moderate';
    return 'minor';
  }
  
  return 'minor';
}

function assessInsuranceImpact(type: string, severity: string, data: any) {
  const wind = data.wind?.speed || 0;
  
  let autoRisk = 'low';
  let homeRisk = 'low';
  let claimsExpected = false;
  
  if (severity === 'extreme' || severity === 'severe') {
    autoRisk = 'high';
    homeRisk = 'high';
    claimsExpected = true;
  } else if (severity === 'moderate') {
    autoRisk = 'medium';
    homeRisk = 'medium';
    claimsExpected = wind > 45;
  }
  
  let coverageReminder = '';
  if (type === 'storm' && homeRisk !== 'low') {
    coverageReminder = 'Review your comprehensive auto coverage and homeowners/renters policy for storm damage protection.';
  }
  
  return {
    auto_risk: autoRisk,
    home_risk: homeRisk,
    claims_expected: claimsExpected,
    coverage_reminder: coverageReminder
  };
}

serve(handler);