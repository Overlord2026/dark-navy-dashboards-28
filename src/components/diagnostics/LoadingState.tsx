
import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <Card>
      <CardContent className="py-10">
        <div className="flex flex-col items-center justify-center text-center">
          <RefreshCw className="h-10 w-10 text-muted-foreground animate-spin" />
          <h3 className="mt-4 text-lg font-medium">Running system diagnostics...</h3>
          <p className="text-muted-foreground mt-2">This may take a moment</p>
        </div>
      </CardContent>
    </Card>
  );
};
