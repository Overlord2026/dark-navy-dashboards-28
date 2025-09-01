import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReadinessBadge } from '@/components/hq/ReadinessBadge';
import { KpiCards } from '@/components/hq/KpiCards';
import { Target, Shield, Users, Zap } from 'lucide-react';

export function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Mission & Readiness */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bfo-card">
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
        </Card>

        <Card className="bfo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-bfo-gold" />
              Readiness Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReadinessBadge />
          </CardContent>
        </Card>
      </div>

      {/* Strategic Pillars */}
      <Card className="bfo-card">
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
      </Card>

      {/* KPI Dashboard */}
      <KpiCards />
    </div>
  );
}