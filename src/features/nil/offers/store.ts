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

export function createOffer({ brand, category, start, end, channels }: {
  brand: string;
  category: string;
  start: string;
  end: string;
  channels: string[];
}) {
  const offerId = `offer_${Date.now()}`;
  const offer: NILOffer = {
    id: offerId,
    offerId,
    offerLock: `offer:${Math.random().toString(16).slice(2)}`,
    brand,
    category,
    amount: 10000, // Default amount
    start,
    end,
    startDate: start,
    endDate: end,
    channels
  };
  offers.push(offer);
  return offer;
}

export function getOffers(): NILOffer[] {
  return [...offers];
}

export function checkConflicts(offerId: string) {
  return { ok: true, conflicts: [] as string[] }; // mark false with codes to demo conflict
}