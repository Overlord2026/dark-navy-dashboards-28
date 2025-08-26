import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReleaseNotes() {
  const [md, setMd] = React.useState<string>("");
  
  React.useEffect(() => {
    try {
      const last = window.localStorage.getItem("lastReleaseSummary") || "";
      setMd(last);
    } catch { 
      /* ignore */ 
    }
  }, []);
  
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Release Notes</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Latest Release Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono">
            {md || "No releases yet."}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}