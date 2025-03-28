
import { BellIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SwagEducationMenu } from "@/components/education/SwagEducationMenu";

export const Header = () => {
  return (
    <div className="w-full px-4 py-3 flex items-center justify-between bg-transparent z-10">
      <div className="flex-1"></div>
      
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
        
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
        </Button>
      </div>
    </div>
  );
};
