import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Trophy, Zap } from 'lucide-react';
import { toast } from 'sonner';

const StartBrandPage = () => {
  const navigate = useNavigate();

  const handleStartBrandWorkspace = () => {
    toast.success('Starting brand workspace...');
    navigate('/brand/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Building2 className="text-sm font-bold text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Brand Workspace Setup</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Welcome to NIL Brand Management</h1>
            <p className="text-xl text-muted-foreground">
              Connect with student-athletes, manage campaigns, and ensure FTC compliance—all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Athlete Discovery</h3>
              <p className="text-sm text-muted-foreground">Find and connect with verified student-athletes</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Campaign Management</h3>
              <p className="text-sm text-muted-foreground">Launch and track NIL marketing campaigns</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Auto-Compliance</h3>
              <p className="text-sm text-muted-foreground">FTC banners and disclosures handled automatically</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              onClick={handleStartBrandWorkspace}
              className="px-8 py-3 text-lg"
            >
              Start Brand Workspace
            </Button>
            <p className="text-sm text-muted-foreground">
              All communications will be automatically logged with FTC compliance tracking
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartBrandPage;