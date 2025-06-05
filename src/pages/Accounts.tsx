
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const Accounts = () => {
  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      title="Accounts"
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Accounts Management</CardTitle>
            <CardDescription className="text-base">
              Advanced account linking and management features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="warning" className="text-sm px-4 py-2">
              Coming Soon
            </Badge>
            <p className="text-muted-foreground mt-4 text-sm">
              We're working on bringing you comprehensive account management tools. 
              Stay tuned for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
