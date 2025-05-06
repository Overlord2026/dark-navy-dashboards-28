
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import BankAccounts from "@/pages/BankAccounts";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const accountsRoutes = [
  {
    path: "/accounts",
    element: (
      <AuthGuard>
        <BankAccounts />
      </AuthGuard>
    ),
  },
];
