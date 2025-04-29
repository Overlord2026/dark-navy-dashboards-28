
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3Icon, ArrowRightIcon } from "lucide-react";

export const AssetsSummary = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Assets</CardTitle>
        <BarChart3Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-6 rounded-md text-center">
          <p className="text-muted-foreground">Connect your accounts to see your assets here</p>
          <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <p className="text-center">Your Plaid-connected assets will appear here</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="ml-auto flex items-center gap-2">
          View Accounts
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssetsSummary;
