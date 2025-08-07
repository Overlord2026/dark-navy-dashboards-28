import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, User, Phone, FileText, Shield, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const healthSummaryItems = [
  { label: 'Last Checkup', value: 'March 2024', icon: Calendar, color: 'text-blue-600' },
  { label: 'Blood Pressure', value: '120/80', icon: Activity, color: 'text-green-600' },
  { label: 'BMI', value: '24.2 (Normal)', icon: Activity, color: 'text-green-600' },
  { label: 'Next Appointment', value: 'Sept 15, 2024', icon: Calendar, color: 'text-orange-600' }
];

const emergencyContacts = [
  { name: 'Dr. Sarah Johnson', role: 'Primary Care', phone: '(555) 123-4567' },
  { name: 'Dr. Michael Chen', role: 'Cardiologist', phone: '(555) 234-5678' },
  { name: 'Jane Smith', role: 'Emergency Contact', phone: '(555) 345-6789' }
];

const insurancePolicies = [
  { provider: 'Blue Cross Blue Shield', type: 'Health Insurance', coverage: 'Family Plan', premium: '$850/month' },
  { provider: 'MetLife', type: 'Dental Insurance', coverage: 'Family Plan', premium: '$120/month' },
  { provider: 'VSP', type: 'Vision Insurance', coverage: 'Family Plan', premium: '$45/month' }
];

export default function HealthcarePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            Proactive Health Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your health records, insurance, and wellness journey in one secure place
          </p>
        </div>
        <Badge variant="secondary" className="text-sm bg-green-100 text-green-700">
          Free Feature
        </Badge>
      </div>

      {/* Health Summary */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Activity className="h-5 w-5" />
            Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthSummaryItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-white rounded-lg"
              >
                <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-semibold text-foreground">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Upload Health Records</h3>
            <p className="text-sm text-muted-foreground">Store test results, prescriptions, and medical history</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Schedule Appointment</h3>
            <p className="text-sm text-muted-foreground">Book with your healthcare providers</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Find Specialists</h3>
            <p className="text-sm text-muted-foreground">Connect with vetted healthcare professionals</p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contacts & Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{contact.phone}</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    Call
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Insurance Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insurancePolicies.map((policy, index) => (
              <motion.div
                key={policy.provider}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{policy.provider}</h3>
                    <p className="text-sm text-muted-foreground">{policy.type} • {policy.coverage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{policy.premium}</p>
                  <p className="text-sm text-green-600">Active</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wellness Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Wellness & Prevention Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Health Tracking</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Vital signs monitoring</li>
                <li>• Medication reminders</li>
                <li>• Symptom tracking</li>
                <li>• Family health history</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Preventive Care</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Annual checkup reminders</li>
                <li>• Screening schedules</li>
                <li>• Vaccination tracking</li>
                <li>• Health risk assessments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}