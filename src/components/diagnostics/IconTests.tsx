
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";

interface IconTestsProps {
  tests: any[];
}

export const IconTests = ({ tests }: IconTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Icon Tests
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
                    <span className="font-medium">{test.icon}</span>
                    <p className="text-sm">Location: {test.location}</p>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-muted">
                  {test.status}
                </span>
              </div>
              <p className="text-sm mt-1">{test.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
