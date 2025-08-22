import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileCheck, 
  Lock, 
  Clock,
  HelpCircle,
  ExternalLink 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TrustFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  techDetails: string;
}

const trustFeatures: TrustFeature[] = [
  {
    icon: <Shield className="h-8 w-8 text-gold" />,
    title: "Smart Checks",
    description: "AI-powered validation ensures every action follows compliance rules and best practices.",
    techDetails: "Rules engine with machine learning validates actions against regulatory requirements, fiduciary standards, and institutional policies in real-time."
  },
  {
    icon: <FileCheck className="h-8 w-8 text-gold" />,
    title: "Proof Slips",
    description: "Every action generates a cryptographic receipt that proves what happened, when, and why.",
    techDetails: "Cryptographic hashing (SHA-256) creates immutable receipts for every transaction, decision, and communication with non-repudiation guarantees."
  },
  {
    icon: <Lock className="h-8 w-8 text-gold" />,
    title: "Secure Vault",
    description: "Bank-grade encryption protects your sensitive information with role-based access controls.",
    techDetails: "AES-256 encryption at rest, TLS 1.3 in transit, zero-knowledge architecture ensures we can't access your data even if we wanted to."
  },
  {
    icon: <Clock className="h-8 w-8 text-gold" />,
    title: "Time-Stamp Anchors",
    description: "Receipts are anchored to immutable timestamping services for legal-grade proof of existence.",
    techDetails: "Merkle tree batching with RFC 3161 timestamping and optional blockchain anchoring provides tamper-evident audit trails that hold up in court."
  }
];

export const TrustExplainer: React.FC = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Built on trust, proven with receipts
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          Every action in our platform creates verifiable proof. Here's how we make trust transparent.
        </p>
        <Button variant="outline" asChild>
          <a href="/how-it-works" className="inline-flex items-center">
            Learn more about our technology
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <TooltipProvider>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => (
            <Card key={index} className="text-center h-full">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  {feature.title}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">{feature.techDetails}</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </TooltipProvider>

      <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg">
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Patent-pending technology
          </span>
          <span>•</span>
          <span>SOC 2 Type II compliant</span>
          <span>•</span>
          <span>Zero-knowledge privacy</span>
          <span>•</span>
          <span>Legal-grade audit trails</span>
        </div>
      </div>
    </div>
  );
};