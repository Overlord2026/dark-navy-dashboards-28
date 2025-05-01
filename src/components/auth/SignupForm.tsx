
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SignupFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (value: boolean) => void;
  handleSignup: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  agreeTerms,
  setAgreeTerms,
  handleSignup,
  isLoading
}) => {
  return (
    <form onSubmit={handleSignup} className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-firstName" className="text-gray-300">First Name</Label>
          <Input 
            id="signup-firstName" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-lastName" className="text-gray-300">Last Name</Label>
          <Input 
            id="signup-lastName" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
        <Input 
          id="signup-email" 
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
        <Input 
          id="signup-password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white"
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={agreeTerms}
          onCheckedChange={() => setAgreeTerms(!agreeTerms)}
        />
        <Label htmlFor="terms" className="text-sm text-gray-300">
          I agree to the{" "}
          <a href="/terms" className="text-blue-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-medium" 
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};
