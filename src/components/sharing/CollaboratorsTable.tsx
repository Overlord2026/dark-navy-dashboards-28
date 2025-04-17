
import { Button } from "@/components/ui/button";
import { Collaborator } from "./types";

interface CollaboratorsTableProps {
  collaborators: Collaborator[];
  onRemove: (id: string) => void;
}

export const CollaboratorsTable = ({ collaborators, onRemove }: CollaboratorsTableProps) => {
  return (
    <div className="rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-900/40">
          <tr>
            <th className="text-left p-3 text-sm font-medium text-gray-400">Name</th>
            <th className="text-left p-3 text-sm font-medium text-gray-400">Email</th>
            <th className="text-left p-3 text-sm font-medium text-gray-400">Role</th>
            <th className="text-left p-3 text-sm font-medium text-gray-400">Access Level</th>
            <th className="text-left p-3 text-sm font-medium text-gray-400">Date Added</th>
            <th className="text-right p-3 text-sm font-medium text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {collaborators.map((collaborator) => (
            <tr key={collaborator.id} className="hover:bg-gray-900/30">
              <td className="p-3">{collaborator.name}</td>
              <td className="p-3">{collaborator.email}</td>
              <td className="p-3">{collaborator.role}</td>
              <td className="p-3 capitalize">{collaborator.accessLevel}</td>
              <td className="p-3">
                {collaborator.dateAdded.toLocaleDateString()}
              </td>
              <td className="p-3 text-right">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Edit</Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-400 hover:text-red-300"
                  onClick={() => onRemove(collaborator.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
