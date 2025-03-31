
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";

interface FormValidationTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const FormValidationTests = ({ tests, isLoading = false }: FormValidationTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Form Validation Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <StatusIcon status={test.status} />
                  <div>
                    <span className="font-medium">{test.formName}</span>
                    <p className="text-sm">Page: {test.location}</p>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-muted">
                  {test.status}
                </span>
              </div>
              <p className="text-sm mt-1">{test.message}</p>
              
              {test.fields && test.fields.length > 0 && (
                <div className="mt-2 pl-8 space-y-2">
                  <p className="text-sm font-medium">Field Tests:</p>
                  {test.fields.map((field: any, fieldIndex: number) => (
                    <div key={fieldIndex} className={`p-2 rounded-md border ${getStatusColor(field.status)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIcon status={field.status} size={4} />
                          <div>
                            <span className="font-medium">{field.fieldName}</span>
                            <p className="text-xs text-muted-foreground">Type: {field.fieldType}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs mt-1">{field.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
