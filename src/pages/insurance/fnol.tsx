import React from 'react';
import { FileText } from 'lucide-react';

const FNOLStub = () => {
  return (
    <div className="min-h-screen bg-bfo-black flex items-center justify-center">
      <div className="text-center">
        <FileText className="h-16 w-16 text-bfo-gold mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">
          First Notice of Loss
        </h1>
        <p className="text-white/80">
          FNOL filing system coming soon...
        </p>
      </div>
    </div>
  );
};

export default FNOLStub;