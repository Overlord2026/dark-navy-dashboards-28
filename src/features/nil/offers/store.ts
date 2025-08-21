export interface NILOffer {
  id: string;
  brand: string;
  category: string;
  startDate: string;
  endDate: string;
  channels: string[];
  amount: number;
  offerLock: string;
  createdAt: string;
}

const offers: NILOffer[] = [
  {
    id: 'offer-1',
    brand: 'Nike',
    category: 'Athletic Apparel',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    channels: ['IG', 'TikTok'],
    amount: 5000,
    offerLock: 'lock_nike_2025_q1',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export function createOffer(params: {
  brand: string;
  category: string;
  startDate: string;
  endDate: string;
  channels: string[];
  amount: number;
}): { offerId: string; offerLock: string } {
  const offerId = `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const offerLock = `lock_${params.brand.toLowerCase()}_${Date.now()}`;
  
  const offer: NILOffer = {
    id: offerId,
    ...params,
    offerLock,
    createdAt: new Date().toISOString()
  };

  offers.push(offer);
  
  return { offerId, offerLock };
}

export function getOffers(): NILOffer[] {
  return [...offers];
}

export function getOffer(id: string): NILOffer | null {
  return offers.find(o => o.id === id) || null;
}

export function checkConflicts(offerId: string): { ok: boolean; conflicts?: string[] } {
  const offer = offers.find(o => o.id === offerId);
  if (!offer) {
    throw new Error('Offer not found');
  }

  const conflicts: string[] = [];
  
  // Check for overlapping offers in same category
  const overlapping = offers.filter(o => 
    o.id !== offerId &&
    o.category === offer.category &&
    new Date(o.startDate) <= new Date(offer.endDate) &&
    new Date(o.endDate) >= new Date(offer.startDate)
  );

  if (overlapping.length > 0) {
    conflicts.push(`Category conflict: ${overlapping.length} overlapping ${offer.category} offers`);
  }

  // Check for channel conflicts
  const channelConflicts = offers.filter(o => 
    o.id !== offerId &&
    o.channels.some(c => offer.channels.includes(c)) &&
    new Date(o.startDate) <= new Date(offer.endDate) &&
    new Date(o.endDate) >= new Date(offer.startDate)
  );

  if (channelConflicts.length > 0) {
    conflicts.push(`Channel conflict: ${channelConflicts.length} overlapping channel offers`);
  }

  return {
    ok: conflicts.length === 0,
    conflicts: conflicts.length > 0 ? conflicts : undefined
  };
}