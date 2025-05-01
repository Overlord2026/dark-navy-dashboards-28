
import React from "react";
import { SocialLoginButton } from "./SocialLoginButton";

interface SocialLoginSectionProps {
  handleSocialLogin: (provider: 'google' | 'microsoft' | 'apple') => void;
  isLoading: boolean;
}

export const SocialLoginSection: React.FC<SocialLoginSectionProps> = ({
  handleSocialLogin,
  isLoading
}) => {
  return (
    <div className="space-y-2">
      <SocialLoginButton 
        provider="google" 
        onClick={() => handleSocialLogin('google')}
        disabled={isLoading}
      />
      <SocialLoginButton 
        provider="microsoft" 
        onClick={() => handleSocialLogin('microsoft')}
        disabled={isLoading}
      />
    </div>
  );
};
