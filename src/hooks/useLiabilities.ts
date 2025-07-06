// Re-export the context hook for backward compatibility
export { useLiabilities, type SupabaseLiability } from '@/context/LiabilitiesContext';

// Legacy export for existing components
export { useLiabilities as useSupabaseLiabilities } from '@/context/LiabilitiesContext';