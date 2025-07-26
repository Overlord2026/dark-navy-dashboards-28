import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, ChevronDown } from 'lucide-react';

interface DocumentType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface DocumentFiltersProps {
  documentTypes: DocumentType[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function DocumentFilters({ 
  documentTypes, 
  selectedCategory, 
  onCategoryChange 
}: DocumentFiltersProps) {
  const selectedType = documentTypes.find(type => type.id === selectedCategory);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {selectedType?.label || 'All Documents'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {documentTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type.id}
              checked={selectedCategory === type.id}
              onCheckedChange={() => onCategoryChange(type.id)}
            >
              <type.icon className="h-4 w-4 mr-2" />
              {type.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedCategory !== 'all' && (
        <Badge 
          variant="secondary" 
          className="cursor-pointer"
          onClick={() => onCategoryChange('all')}
        >
          {selectedType?.label}
          ✕
        </Badge>
      )}
    </div>
  );
}