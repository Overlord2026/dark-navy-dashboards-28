import React from 'react';
import { ClipboardCheck } from 'lucide-react';

const BindStub = () => {
  return (
    <div className="min-h-screen bg-bfo-black flex items-center justify-center">
      <div className="text-center">
        <ClipboardCheck className="h-16 w-16 text-bfo-gold mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">
          Policy Binding
        </h1>
        <p className="text-white/80">
          Policy binding system coming soon...
        </p>
      </div>
    </div>
  );
};

export default BindStub;