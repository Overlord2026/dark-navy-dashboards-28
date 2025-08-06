import React from 'react';
import { VipDirectory } from '@/components/vip/VipDirectory';

export default function VipDirectoryPage() {
  return (
    <div className="container mx-auto p-6">
      <VipDirectory showPublicOnly={true} allowBooking={true} />
    </div>
  );
}