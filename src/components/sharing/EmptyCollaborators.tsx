
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export const EmptyCollaborators = () => {
  return (
    <div className="text-center py-10 bg-[#071429] rounded-lg border border-gray-800">
      <Users size={60} className="mx-auto text-blue-500/60 mb-4" />
      <h3 className="text-xl font-medium mb-3">No Family Members Added</h3>
      <p className="text-gray-400 text-base max-w-md mx-auto mb-6">
        Share access with your family members by inviting them to collaborate on financial planning, document access, and more.
      </p>
      <Link 
        to="/sharing?add=family"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex"
      >
        Get Started
      </Link>
    </div>
  );
};
