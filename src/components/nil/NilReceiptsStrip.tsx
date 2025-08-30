import { Link } from 'react-router-dom';
import { getNilFixturesHealth } from '@/fixtures/fixtures.nil';
import { listReceipts } from '@/features/receipts/record';
import { Check } from 'lucide-react';

export default function NilReceiptsStrip() {
  // Get health status and receipts safely
  const health = getNilFixturesHealth();
  
  // Get last 5 NIL-related receipts with fallback handling
  let nilReceipts = [];
  try {
    const allReceipts = listReceipts();
    nilReceipts = allReceipts
      .filter(receipt => 
        receipt.context === 'NIL' || 
        receipt.type?.includes('NIL') ||
        receipt.action === 'education' ||
        receipt.action === 'offer_create' ||
        receipt.action === 'invite_create' ||
        receipt.action === 'catalog_view' ||
        receipt.action?.startsWith('cosign.')
      )
      .slice(0, 5);
  } catch (error) {
    // Use fallback receipts from health check if needed
    nilReceipts = health.dataLoaded?.receipts ? [] : [];
  }

  if (nilReceipts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bfo-black/95 backdrop-blur-sm border-t border-bfo-gold/20 z-40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-white/60 whitespace-nowrap">Trust Rails:</span>
              {health.isUsingFallback && (
                <span className="text-xs text-orange-400/80 whitespace-nowrap">(Fallback)</span>
              )}
            </div>
            {nilReceipts.map((receipt, index) => (
              <Link
                key={receipt.id || index}
                to="/nil/receipts"
                className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#24313d]/60 hover:bg-[#24313d] transition-colors group whitespace-nowrap"
              >
                <span className="text-xs text-white/80 group-hover:text-white">
                  {receipt.type || 'Action'} • {receipt.result || 'completed'}
                </span>
                {(receipt.anchor_ref?.accepted || receipt.anchor_ref?.status === 'anchored') && (
                  <Check className="h-3 w-3 text-bfo-gold" />
                )}
              </Link>
            ))}
          </div>
          <Link
            to="/nil/receipts"
            className="text-xs text-bfo-gold hover:text-white transition-colors whitespace-nowrap ml-4"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
}