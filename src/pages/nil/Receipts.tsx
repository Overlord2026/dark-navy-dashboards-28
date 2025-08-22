import React from 'react';
import ReceiptsTable from '@/components/receipts/ReceiptsTable';

export default function ReceiptsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NIL Receipts</h1>
        <p className="text-muted-foreground">View and verify compliance receipts</p>
      </div>
      
      <ReceiptsTable />
    </div>
  );
}