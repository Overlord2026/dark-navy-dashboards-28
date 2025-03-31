
import { Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";

interface NavigationTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const NavigationTests = ({ tests, isLoading = false }: NavigationTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Navigation Route Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon status={test.status} />
                  <span className="font-medium">{test.route}</span>
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
