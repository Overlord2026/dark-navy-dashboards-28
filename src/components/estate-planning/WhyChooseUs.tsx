
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Edit, Share, Users, Shield, BookOpen } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      title: "Secure Vault",
      description: "All your estate planning documents are stored in a secure digital vault with bank-level encryption.",
      icon: Lock
    },
    {
      title: "Easy Future Updates",
      description: "Make changes and updates to your estate plan as your life circumstances evolve, with professional guidance.",
      icon: Edit
    },
    {
      title: "Secure Sharing",
      description: "Safely share important documents with family members and trusted professionals when needed.",
      icon: Share
    },
    {
      title: "Personalized Approach",
      description: "We take the time to understand your unique situation and create customized solutions.",
      icon: Users
    },
    {
      title: "Comprehensive Protection",
      description: "Our holistic approach ensures all aspects of your estate and legacy are protected.",
      icon: Shield
    },
    {
      title: "Expert Guidance",
      description: "Work with experienced professionals who specialize in estate planning and wealth preservation.",
      icon: BookOpen
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Why Choose Our Estate Planning Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
              </div>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
