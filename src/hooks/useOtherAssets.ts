// Re-export the context hook for backward compatibility
export { useOtherAssets, type OtherAsset, type OtherAssetData, type SupabaseAsset } from '@/context/OtherAssetsContext';

// Legacy export for existing components
export { useOtherAssets as useSupabaseAssets } from '@/context/OtherAssetsContext';