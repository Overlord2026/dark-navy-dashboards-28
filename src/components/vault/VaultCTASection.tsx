import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, 
  Upload, 
  Users, 
  Heart, 
  Shield,
  Sparkles 
} from 'lucide-react';

interface VaultCTASectionProps {
  onRecordMessage: () => void;
  onUploadFile: () => void;
  onInviteFamily: () => void;
}

export function VaultCTASection({ 
  onRecordMessage, 
  onUploadFile, 
  onInviteFamily 
}: VaultCTASectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Record Message CTA */}
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-gold/20">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center mb-4 group-hover:animate-pulse">
            <Mic className="h-8 w-8 text-navy" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gold">Record a Message</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Leave a heartfelt video or audio message for your family's future
            </p>
          </div>
          <Button 
            onClick={onRecordMessage}
            variant="gold"
            size="lg"
            className="w-full touch-target-large gap-2 group-hover:shadow-lg group-hover:shadow-gold/25"
          >
            <Sparkles className="h-4 w-4" />
            Start Recording
          </Button>
        </CardContent>
      </Card>

      {/* Upload File CTA */}
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-emerald/10 via-emerald/5 to-transparent border-emerald/20">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald to-emerald/80 rounded-full flex items-center justify-center mb-4 group-hover:animate-pulse">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-emerald">Upload File</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Securely store photos, documents, and important family files
            </p>
          </div>
          <Button 
            onClick={onUploadFile}
            variant="success"
            size="lg"
            className="w-full touch-target-large gap-2 group-hover:shadow-lg group-hover:shadow-emerald/25"
          >
            <Shield className="h-4 w-4" />
            Upload Securely
          </Button>
        </CardContent>
      </Card>

      {/* Invite Family CTA */}
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4 group-hover:animate-pulse">
            <Users className="h-8 w-8 text-navy" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">Invite Family</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your legacy vault with family members and loved ones
            </p>
          </div>
          <Button 
            onClick={onInviteFamily}
            variant="premium"
            size="lg"
            className="w-full touch-target-large gap-2 group-hover:shadow-lg group-hover:shadow-primary/25"
          >
            <Heart className="h-4 w-4" />
            Invite Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}