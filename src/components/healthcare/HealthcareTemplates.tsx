
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentPermission } from "@/types/document";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  permissions: DocumentPermission[];
  lastUpdated: string;
}

const templates: Template[] = [
  {
    id: "1",
    name: "HIPAA Authorization Form",
    description: "Standard HIPAA Authorization form for disclosure of protected health information.",
    category: "Legal Documents",
    permissions: [
      {
        userId: "admin1",
        userName: "Admin User",
        userRole: "System Administrator",
        accessLevel: "admin",
        grantedBy: "System",
        grantedAt: "2023-01-15T12:00:00Z"
      }
    ],
    lastUpdated: "2023-08-15"
  },
  {
    id: "2",
    name: "Medical History Questionnaire",
    description: "Comprehensive medical history questionnaire for new patients.",
    category: "Intake Forms",
    permissions: [
      {
        userId: "admin1",
        userName: "Admin User",
        userRole: "System Administrator",
        accessLevel: "admin",
        grantedBy: "System",
        grantedAt: "2023-02-20T14:30:00Z"
      }
    ],
    lastUpdated: "2023-09-01"
  },
  {
    id: "3",
    name: "Medication List Template",
    description: "Template for tracking current medications, dosages, and schedules.",
    category: "Medical Records",
    permissions: [
      {
        userId: "admin1",
        userName: "Admin User",
        userRole: "System Administrator",
        accessLevel: "admin",
        grantedBy: "System",
        grantedAt: "2023-03-10T09:15:00Z"
      }
    ],
    lastUpdated: "2023-07-22"
  },
  {
    id: "4",
    name: "Advanced Directive",
    description: "Legal document outlining a person's wishes regarding medical treatments.",
    category: "Legal Documents",
    permissions: [
      {
        userId: "admin1",
        userName: "Admin User",
        userRole: "System Administrator",
        accessLevel: "admin",
        grantedBy: "System",
        grantedAt: "2023-04-05T16:45:00Z"
      }
    ],
    lastUpdated: "2023-06-30"
  }
];

export function HealthcareTemplates() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Templates</h2>
        <Button>Create New Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="bg-blue-50 dark:bg-blue-950">
              <CardTitle>{template.name}</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-300">
                {template.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
              <div className="mt-3 text-xs text-gray-500">
                Last updated: {new Date(template.lastUpdated).toLocaleDateString()}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 bg-gray-50 dark:bg-gray-900">
              <Button variant="outline" size="sm">
                Preview
              </Button>
              <Button size="sm">Use Template</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
