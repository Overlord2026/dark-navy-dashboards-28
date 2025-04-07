
import React, { useState } from "react";
import { EducationalResource } from "@/types/education";
import { useEducationContent } from "@/context/EducationContentContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import { ResourceForm } from "./ResourceForm";

interface ResourcesListProps {
  type: "guides" | "books" | "whitepapers";
}

export const ResourcesList: React.FC<ResourcesListProps> = ({ type }) => {
  const { resources, whitepapers, addResource, updateResource, deleteResource, addWhitepaper, updateWhitepaper, deleteWhitepaper } = useEducationContent();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<EducationalResource | undefined>(undefined);
  
  let resourcesList: EducationalResource[] = [];
  
  if (type === "whitepapers") {
    resourcesList = whitepapers;
  } else {
    resourcesList = resources[type];
  }
  
  const handleAdd = (resource: EducationalResource) => {
    if (type === "whitepapers") {
      addWhitepaper(resource);
    } else {
      addResource(resource, type);
    }
    setIsAddDialogOpen(false);
  };
  
  const handleEdit = (resource: EducationalResource) => {
    if (type === "whitepapers") {
      updateWhitepaper(resource);
    } else {
      updateResource(resource, type);
    }
    setIsEditDialogOpen(false);
    setSelectedResource(undefined);
  };
  
  const handleDelete = (resourceId: string) => {
    if (confirm(`Are you sure you want to delete this ${type === "guides" ? "guide" : type === "books" ? "book" : "whitepaper"}?`)) {
      if (type === "whitepapers") {
        deleteWhitepaper(resourceId);
      } else {
        deleteResource(resourceId, type);
      }
    }
  };
  
  const openEditDialog = (resource: EducationalResource) => {
    setSelectedResource(resource);
    setIsEditDialogOpen(true);
  };

  const resourceType = type === "guides" ? "guide" : type === "books" ? "book" : "whitepaper";
  const titleText = type === "guides" ? "Guides" : type === "books" ? "Books" : "Whitepapers";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{titleText}</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="mr-1 h-4 w-4" /> Add {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Level</TableHead>
              {type === "books" && <TableHead>Author</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resourcesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={type === "books" ? 5 : 4} className="text-center py-4 text-muted-foreground">
                  No {titleText.toLowerCase()} found. Add your first {resourceType}.
                </TableCell>
              </TableRow>
            ) : (
              resourcesList.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {resource.title}
                      {resource.ghlUrl && (
                        <a 
                          href={resource.ghlUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="ml-2 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{resource.level}</TableCell>
                  {type === "books" && <TableCell>{resource.author || "—"}</TableCell>}
                  <TableCell>
                    {resource.isPaid ? (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Free
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(resource)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(resource.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new {resourceType}.
            </DialogDescription>
          </DialogHeader>
          <ResourceForm 
            resourceType={type === "guides" ? "guide" : type === "books" ? "book" : "whitepaper"}
            onSubmit={handleAdd} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}</DialogTitle>
            <DialogDescription>
              Update the {resourceType} details.
            </DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <ResourceForm 
              resourceType={type === "guides" ? "guide" : type === "books" ? "book" : "whitepaper"}
              resource={selectedResource} 
              onSubmit={handleEdit} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
