import React from 'react';
import { getFlag } from '@/config/flags';
import { MegaMenu } from './MegaMenu';
import { MegaMenuV2 } from './MegaMenuV2';

/**
 * Conditional navigation component that switches between old and new IA
 * based on the IA_V2 feature flag
 */
export function ConditionalMegaMenu() {
  const useNewIA = getFlag('IA_V2');
  
  if (useNewIA) {
    return <MegaMenuV2 />;
  }
  
  return <MegaMenu />;
}