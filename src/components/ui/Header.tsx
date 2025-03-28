
import { BellIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="w-full px-4 py-3 flex items-center justify-between bg-[#12121C] z-10">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground">BF</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1 mr-1 bg-[#1B1B32] border-gray-700 text-[#E2E2E2]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="hover:bg-[#1c2e4a] cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#1c2e4a] cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#1c2e4a] cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="hover:bg-[#1c2e4a] cursor-pointer">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
