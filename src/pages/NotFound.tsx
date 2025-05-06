import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router-dom";
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  return <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 text-accent mb-6">
          <AlertTriangleIcon className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6 text-zinc-50">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-accent hover:bg-accent/90 text-white">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>;
};
export default NotFound;