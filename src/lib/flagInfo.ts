// Feature flags information utilities
import { FLAGS } from '@/config/flags';

export function getFlags(): Record<string, any> {
  // Return FLAGS as a plain object for compatibility
  // Note: FLAGS is read-only, so mutations won't persist
  return { ...FLAGS };
}

export function setFlagSafe(key: string, val: boolean): Record<string, any> {
  // FLAGS is read-only (const), so this is a no-op
  // Return current flags state
  console.warn('setFlagSafe: FLAGS is read-only, cannot set', key, val);
  return getFlags();
}
