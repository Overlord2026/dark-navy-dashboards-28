// Feature flags information utilities
import { flags, setFlag } from '@/config/flags';

export function getFlags(): Record<string, boolean> {
  // Return shallow copy to avoid mutations
  return { ...flags };
}

export function setFlagSafe(key: string, val: boolean): Record<string, boolean> {
  // Only allow setting if key exists in current flags
  if (key in flags) {
    setFlag(key, val);
  }
  return getFlags();
}