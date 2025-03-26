
import { GraduationCap } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function SwagEducationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          <GraduationCap className="h-5 w-5" />
          <span>SWAG Education Vault</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Available Courses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Financial Fundamentals
        </DropdownMenuItem>
        <DropdownMenuItem>
          Investment Strategies 101
        </DropdownMenuItem>
        <DropdownMenuItem>
          Wealth Building for Beginners
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Premium Courses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="opacity-70">
          Advanced Trading (Coming Soon)
        </DropdownMenuItem>
        <DropdownMenuItem className="opacity-70">
          Estate Planning (Coming Soon)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
