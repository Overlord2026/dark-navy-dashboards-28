import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Shield, Users, Zap, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OverviewTab() {
  const [readinessCheck, setReadinessCheck] = useState<{
    status: 'idle' | 'running' | 'complete';
    result?: 'green' | 'amber' | 'red';
    reasons?: string[];
  }>({ status: 'idle' });

  const runReadinessCheck = async () => {
    setReadinessCheck({ status: 'running' });
    
    // Simulate readiness check
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setReadinessCheck({
      status: 'complete',
      result: 'green',
      reasons: [
        'All core services operational',
        'Zero 404 routes detected',
        'Brand compliance: 100%',
        'Receipt pipeline verified',
        'Demo fixtures loaded'
      ]
    });
  };

  const getStatusIcon = (result?: 'green' | 'amber' | 'red') => {
    switch (result) {
      case 'green': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'amber': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'red': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Mission & Readiness */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bfo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-bfo-gold" />
              Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <p className="text-lg leading-relaxed">
              Empower family offices with comprehensive wealth management tools, 
              regulatory compliance, and strategic advisory services through 
              innovative technology and trusted partnerships.
            </p>
          </CardContent>
        </div>

        <div className="bfo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-bfo-gold" />
              Readiness Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runReadinessCheck}
              disabled={readinessCheck.status === 'running'}
              className="btn-gold"
            >
              {readinessCheck.status === 'running' ? 'Running Check...' : 'Run Readiness Check'}
            </Button>
            
            {readinessCheck.status === 'complete' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(readinessCheck.result)}
                  <span className="text-white font-semibold">
                    Status: {readinessCheck.result?.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  {readinessCheck.reasons?.map((reason, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bfo-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Households</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bfo-gold">2,847</div>
            <p className="text-xs text-gray-300">+12% this quarter</p>
          </CardContent>
        </div>

        <div className="bfo-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Pro Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bfo-gold">1,523</div>
            <p className="text-xs text-gray-300">Active professionals</p>
          </CardContent>
        </div>

        <div className="bfo-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Tools/Seat/Mo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bfo-gold">7.3</div>
            <p className="text-xs text-gray-300">Average utilization</p>
          </CardContent>
        </div>

        <div className="bfo-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bfo-gold">$4.2M</div>
            <p className="text-xs text-gray-300">Monthly recurring</p>
          </CardContent>
        </div>
      </div>

      {/* Strategic Pillars */}
      <div className="bfo-card">
        <CardHeader>
          <CardTitle className="text-white">Strategic Pillars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-bfo-gold" />
                <h3 className="font-semibold text-white">Client Excellence</h3>
              </div>
              <p className="text-sm text-gray-300">
                Deliver exceptional service experiences through personalized advisory 
                and cutting-edge digital tools.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-bfo-gold" />
                <h3 className="font-semibold text-white">Regulatory Leadership</h3>
              </div>
              <p className="text-sm text-gray-300">
                Maintain industry-leading compliance standards and proactive 
                regulatory guidance.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-bfo-gold" />
                <h3 className="font-semibold text-white">Innovation Engine</h3>
              </div>
              <p className="text-sm text-gray-300">
                Drive continuous innovation in wealth management technology 
                and service delivery.
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}