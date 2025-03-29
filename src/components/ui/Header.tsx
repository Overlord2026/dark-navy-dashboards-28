
import { BellIcon, SearchIcon, GraduationCapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SwagEducationMenu } from "@/components/education/SwagEducationMenu";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="w-full px-4 py-3 flex flex-col items-center justify-between bg-transparent z-10">
      {/* Prominent logo at top center */}
      <div className="w-full flex justify-center mb-4">
        <img 
          src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
          alt="Boutique Family Office Logo" 
          className="h-20 w-auto"
        />
      </div>
      
      <div className="w-full flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link to="/education">
            <Button variant="ghost" className="flex items-center gap-1 transition-colors hover:bg-accent/20">
              <GraduationCapIcon className="h-5 w-5" />
              <span className="font-medium">Education Center</span>
            </Button>
          </Link>
        </div>
        
        <div className="hidden md:flex relative max-w-md w-full mx-8">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-10 bg-muted/50 border-muted focus-visible:ring-accent"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <SwagEducationMenu />
          
          <Button variant="ghost" size="icon" className="relative transition-colors hover:bg-accent/20">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
          </Button>
        </div>
      </div>
    </div>
  );
};
