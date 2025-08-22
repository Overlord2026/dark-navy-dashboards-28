export interface NILOffer {
  id: string;
  offerId: string;
  offerLock: string;
  brand: string;
  category: string;
  amount: number;
  start: string;
  end: string;
  startDate: string;
  endDate: string;
  channels: string[];
}

const offers: NILOffer[] = [];

export function createOffer({ brand, category, startDate, endDate, channels, amount }: {
  brand: string;
  category: string;
  startDate: string;
  endDate: string;
  channels: string[];
  amount?: number;
}) {
  const offerId = `offer_${Date.now()}`;
  const offer: NILOffer = {
    id: offerId,
    offerId,
    offerLock: `offer:${Math.random().toString(16).slice(2)}`,
    brand,
    category,
    amount: amount || 10000, // Default amount
    start: startDate,
    end: endDate,
    startDate,
    endDate,
    channels
  };
  offers.push(offer);
  return { offerId, offerLock: offer.offerLock };
}

export function getOffers(): NILOffer[] {
  return [...offers];
}

export function checkConflicts(offerId: string) {
  return { ok: true, conflicts: [] as string[] }; // mark false with codes to demo conflict
}