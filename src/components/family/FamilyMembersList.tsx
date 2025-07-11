import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, Edit, Trash2, Mail, UserPlus } from 'lucide-react';
import { useFamilyMembers, FamilyMember } from '@/hooks/useFamilyMembers';
import { EditFamilyMemberDialog } from './EditFamilyMemberDialog';
import { AddFamilyMemberDialog } from './AddFamilyMemberDialog';

const formatRelationship = (relationship: string) => {
  return relationship
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
};

export const FamilyMembersList: React.FC = () => {
  const { familyMembers, isLoading, deleteFamilyMember } = useFamilyMembers();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);

  const handleEditClick = (member: FamilyMember) => {
    setMemberToEdit(member);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (member: FamilyMember) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (memberToDelete) {
      await deleteFamilyMember(memberToDelete.id);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Loading family members...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="mb-2">Family Members</CardTitle>
            <CardDescription>
              Manage family members and their access to your account
            </CardDescription>
          </div>
          <AddFamilyMemberDialog>
            <Button className="w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </AddFamilyMemberDialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {familyMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No family members found. Add family members who should have access to your financial information.
                  </TableCell>
                </TableRow>
              ) : (
                familyMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{formatRelationship(member.relationship)}</TableCell>
                    <TableCell>
                      {member.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {member.email}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No email</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.access_level === 'full' ? 'default' : 'secondary'}>
                        {member.access_level === 'full' ? 'Full Access' : 'Limited Access'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(member)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(member)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditFamilyMemberDialog
        member={memberToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Family Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToDelete?.name} from your family members? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};