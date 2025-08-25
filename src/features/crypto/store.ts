import type { Wallet, Position, Tx, TaxLot } from './types';

let WALLETS: Record<string, Wallet> = {};
let POS: Record<string, Position[]> = {};
let TXS: Record<string, Tx[]> = {};
let LOTS: Record<string, TaxLot[]> = {};

export async function upsertWallet(w: Wallet): Promise<Wallet> { 
  WALLETS[w.walletId] = w; 
  return w; 
}

export async function listWallets(userId: string): Promise<Wallet[]> { 
  return Object.values(WALLETS).filter(w => w.ownerUserId === userId); 
}

export async function getWallet(walletId: string): Promise<Wallet | undefined> {
  return WALLETS[walletId];
}

export async function setPositions(walletId: string, p: Position[]): Promise<void> { 
  POS[walletId] = p; 
}

export async function getPositions(walletId: string): Promise<Position[]> {
  return POS[walletId] || [];
}

export async function addTx(walletId: string, t: Tx): Promise<void> { 
  (TXS[walletId] ||= []).push(t); 
}

export async function getTxs(walletId: string): Promise<Tx[]> {
  return TXS[walletId] || [];
}

export async function setLots(walletId: string, lots: TaxLot[]): Promise<void> { 
  LOTS[walletId] = lots; 
}

export async function getLots(walletId: string): Promise<TaxLot[]> {
  return LOTS[walletId] || [];
}