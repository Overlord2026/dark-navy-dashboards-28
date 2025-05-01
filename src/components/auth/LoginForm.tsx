
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  isLoading
}) => {
  return (
    <form onSubmit={handleLogin} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-gray-300">Email</Label>
        <Input 
          id="login-email" 
          type="email" 
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white"
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-gray-300">Password</Label>
          <a href="/forgot-password" className="text-sm text-blue-400 hover:underline">
            Forgot password?
          </a>
        </div>
        <Input 
          id="login-password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
