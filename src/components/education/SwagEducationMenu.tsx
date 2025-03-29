
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
import { Link } from "react-router-dom";

export function SwagEducationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          <GraduationCap className="h-5 w-5" />
          <span>SWAG Education Vault</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Course Categories</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/education">
          <DropdownMenuItem>
            All Courses
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          Retirement Income Planning Basics
        </DropdownMenuItem>
        <DropdownMenuItem>
          Social Security Optimization
        </DropdownMenuItem>
        <DropdownMenuItem>
          Retirement Income Distribution Optimization
        </DropdownMenuItem>
        <DropdownMenuItem>
          Understanding Annuities
        </DropdownMenuItem>
        <DropdownMenuItem>
          Proactive Tax Planning
        </DropdownMenuItem>
        <DropdownMenuItem>
          Advanced Tax Planning
        </DropdownMenuItem>
        <DropdownMenuItem>
          Holistic Wealth Management
        </DropdownMenuItem>
        <DropdownMenuItem>
          Estate Planning Basics
        </DropdownMenuItem>
        <DropdownMenuItem>
          Benefits of Florida Residency
        </DropdownMenuItem>
        <DropdownMenuItem>
          Benefits of Texas Residency
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Featured Courses</DropdownMenuLabel>
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
