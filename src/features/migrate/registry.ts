import type { Incumbent, Adapter, Persona } from './types';

const REGISTRY: Record<Incumbent, Adapter> = {} as any;

export function registerAdapter(a:Adapter){ 
  REGISTRY[a.key]=a; 
}

export function getAdapter(k:Incumbent){ 
  return REGISTRY[k]; 
}

export function listAdaptersByPersona(p:Persona){ 
  return Object.values(REGISTRY).filter(a=>a.persona===p); 
}