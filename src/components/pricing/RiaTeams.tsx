import { useState } from 'react';
import { Check, Users, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const seatTiers = [
  { range: '5-19 seats', price: 79 },
  { range: '20-49 seats', price: 69 },
  { range: '50+ seats', price: 59 }
];

const includedFeatures = [
  'Enterprise-grade security',
  'Unlimited client management',
  'Advanced portfolio analytics',
  'Custom branded reports',
  'API integrations',
  'Dedicated account manager',
  'Priority support',
  'Compliance suite',
  'Team collaboration tools',
  'Admin dashboard'
];

const addOns = [
  { name: 'Advanced CRM Integration', price: 15 },
  { name: 'Custom Reporting Suite', price: 25 },
  { name: 'Third-party Data Feeds', price: 35 },
  { name: 'White-label Solutions', price: 50 }
];

export function RiaTeams() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [seatCount, setSeatCount] = useState(10);

  const calculatePrice = (seats: number) => {
    const basePrice = 499; // Platform minimum for 5 seats
    
    if (seats <= 5) return basePrice;
    
    let additionalSeats = seats - 5;
    let totalPrice = basePrice;
    
    if (additionalSeats <= 14) { // 6-19 seats
      totalPrice += additionalSeats * 79;
    } else if (additionalSeats <= 44) { // 20-49 seats  
      totalPrice += 14 * 79 + (additionalSeats - 14) * 69;
    } else { // 50+ seats
      totalPrice += 14 * 79 + 30 * 69 + (additionalSeats - 44) * 59;
    }
    
    return isAnnual ? Math.round(totalPrice * 0.8) : totalPrice;
  };

  const getSeatPrice = (seats: number) => {
    if (seats >= 50) return 59;
    if (seats >= 20) return 69;
    return 79;
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">RIA Teams</h2>
          <p className="text-muted-foreground">Enterprise solutions for growing advisory firms</p>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Pricing Calculator */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Price
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Seats</label>
                  <Input
                    type="number"
                    min="5"
                    value={seatCount}
                    onChange={(e) => setSeatCount(Math.max(5, parseInt(e.target.value) || 5))}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Platform minimum: 5 seats ($499/mo)
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Seat Pricing Tiers:</h4>
                  {seatTiers.map((tier) => (
                    <div key={tier.range} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">{tier.range}</span>
                      <span className="font-medium">${tier.price}/seat/month</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      ${calculatePrice(seatCount).toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">
                      {isAnnual ? 'per year' : 'per month'} • {seatCount} seats
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      ${getSeatPrice(seatCount)}/seat {isAnnual ? '(after 20% discount)' : ''}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="space-y-3">
                <Button className="w-full" size="lg">
                  Start Enterprise Trial
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Demo
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* What's Included */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  What's Included
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {includedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg">Popular Add-ons</CardTitle>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {addOns.map((addon, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{addon.name}</span>
                      <span className="text-sm font-medium">+${addon.price}/seat</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RiaTeams;