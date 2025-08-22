import React from 'react';

export const PatentFooter: React.FC = () => {
  return (
    <div className="border-t bg-muted/30 py-6">
      <div className="container mx-auto px-6">
        <p className="text-sm text-muted-foreground text-center max-w-4xl mx-auto">
          Certain features are the subject of pending patent applications. 
          This presentation does not disclose proprietary algorithms or trade secrets.
        </p>
      </div>
    </div>
  );
};