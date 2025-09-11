/**
 * Asset Registry Service
 * Manages HNW assets with privacy-preserving value bands
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import * as Canonical from '@/lib/canonical';

type AssetType =
  | 'home_high_value' | 'exotic_auto' | 'marine_boat' | 'marine_yacht' | 'rv'
  | 'fine_art' | 'jewelry' | 'umbrella' | 'flood' | 'earthquake'
  | 'landlord_property' | 'entity_owned' | 'cyber' | 'kidnap_ransom';

type AssetDocType =
  | 'declaration' | 'appraisal' | 'survey' | 'registration'
  | 'certificate' | 'inspection' | 'photos' | 'title' | 'other';

type ReminderType =
  | 'appraisal_due' | 'registration_renewal' | 'marine_layup'
  | 'storm_alert' | 'umbrella_check' | 'policy_renewal';

const assetTypeMap: Record<string, AssetType> = {
  flood:'flood', home_high_value:'home_high_value', exotic_auto:'exotic_auto',
  marine_boat:'marine_boat', marine_yacht:'marine_yacht', rv:'rv',
  fine_art:'fine_art', jewelry:'jewelry', umbrella:'umbrella', earthquake:'earthquake',
  landlord_property:'landlord_property', entity_owned:'entity_owned',
  cyber:'cyber', kidnap_ransom:'kidnap_ransom'
};

const docTypeMap: Record<string, AssetDocType> = {
  declaration:'declaration', appraisal:'appraisal', survey:'survey', registration:'registration',
  certificate:'certificate', inspection:'inspection', photos:'photos', title:'title', other:'other'
};

const reminderTypeMap: Record<string, ReminderType> = {
  appraisal_due:'appraisal_due', registration_renewal:'registration_renewal',
  marine_layup:'marine_layup', storm_alert:'storm_alert',
  umbrella_check:'umbrella_check', policy_renewal:'policy_renewal'
};

function asAssetType(s: string): AssetType { return assetTypeMap[s] ?? 'home_high_value'; }
function asDocType(s: string): AssetDocType { return docTypeMap[s] ?? 'other'; }
function asReminderType(s: string): ReminderType { return reminderTypeMap[s] ?? 'policy_renewal'; }

export interface Asset {
  id: string;
  user_id: string;
  asset_type: AssetType;
  asset_name: string;
  acquisition_date?: string;
  current_value_band?: 'under_100k' | '100k_500k' | '500k_1m' | '1m_5m' | '5m_10m' | 'over_10m';
  location_zip_first3?: string;
  status: 'active' | 'sold' | 'disposed';
  metadata?: Record<string, any>;
  last_appraisal_date?: string;
  next_appraisal_due?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetDoc {
  id: string;
  asset_id: string;
  document_type: AssetDocType;
  document_name: string;
  vault_hash: string;
  file_size_bytes?: number;
  upload_date: string;
  expiry_date?: string;
  created_by: string;
}

export interface AssetReminder {
  id: string;
  asset_id: string;
  reminder_type: ReminderType;
  reminder_date: string;
  title: string;
  description?: string;
  notification_methods: string[];
  status: 'pending' | 'sent' | 'acknowledged' | 'dismissed';
}

/**
 * Create a new asset with value banding for privacy
 */
export async function createAsset(
  assetData: Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<string> {
  const { data, error } = await supabase
    .from('assets')
    .insert({
      ...assetData,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select('id')
    .single();

  if (error) throw error;

  // Record Asset-RDS
  await recordReceipt({
    type: 'Asset-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    asset_id: data.id,
    asset_type: assetData.asset_type,
    value_band: assetData.current_value_band || 'unspecified',
    location_hash: assetData.location_zip_first3 ? 
      await inputs_hash({ zip_first3: assetData.location_zip_first3 }) : undefined
  });

  return data.id;
}

/**
 * Get assets for current user
 */
export async function getAssets(filters?: {
  asset_type?: string;
  status?: string;
}): Promise<Asset[]> {
  let query = supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.asset_type) {
    query = query.eq('asset_type', filters.asset_type);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(r => ({
    ...r,
    asset_type: asAssetType(String(r.asset_type))
  })) as Asset[];
}

/**
 * Get asset by ID with documents and advice
 */
export async function getAssetDetails(assetId: string): Promise<{
  asset: Asset;
  documents: AssetDoc[];
  advice: any[];
  reminders: AssetReminder[];
}> {
  const [assetResult, docsResult, adviceResult, remindersResult] = await Promise.all([
    supabase.from('assets').select('*').eq('id', assetId).single(),
    supabase.from('asset_docs').select('*').eq('asset_id', assetId).order('upload_date', { ascending: false }),
    supabase.from('asset_advice').select('*').eq('asset_id', assetId).order('created_at', { ascending: false }),
    supabase.from('asset_reminders').select('*').eq('asset_id', assetId).order('reminder_date', { ascending: true })
  ]);

  if (assetResult.error) throw assetResult.error;

  return {
    asset: { ...assetResult.data, asset_type: asAssetType(String(assetResult.data.asset_type)) } as Asset,
    documents: (docsResult.data || []).map(d => ({ ...d, document_type: asDocType(String(d.document_type)) })) as AssetDoc[],
    advice: adviceResult.data || [],
    reminders: (remindersResult.data || []).map(x => ({ ...x, reminder_type: asReminderType(String(x.reminder_type)) })) as AssetReminder[]
  };
}

/**
 * Add document to asset with Vault storage
 */
export async function addAssetDoc(
  assetId: string,
  docData: Omit<AssetDoc, 'id' | 'asset_id' | 'upload_date' | 'created_by'>
): Promise<string> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('asset_docs')
    .insert({
      ...docData,
      asset_id: assetId,
      created_by: user.id
    })
    .select('id')
    .single();

  if (error) throw error;

  // Record AssetDoc-RDS
  await recordReceipt({
    type: 'AssetDoc-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    asset_id: assetId,
    document_id: data.id,
    document_type: docData.document_type,
    vault_hash: docData.vault_hash,
    file_size_band: docData.file_size_bytes ? 
      bandFileSize(docData.file_size_bytes) : 'unknown'
  });

  return data.id;
}

/**
 * Schedule reminder for asset
 */
export async function scheduleReminder(
  assetId: string,
  reminderData: Omit<AssetReminder, 'id' | 'asset_id' | 'status'>
): Promise<string> {
  const { data, error } = await supabase
    .from('asset_reminders')
    .insert({
      ...reminderData,
      asset_id: assetId,
      status: 'pending'
    })
    .select('id')
    .single();

  if (error) throw error;

  // Record AssetReminder-RDS
  await recordReceipt({
    type: 'AssetReminder-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    asset_id: assetId,
    reminder_id: data.id,
    reminder_type: reminderData.reminder_type,
    reminder_date: reminderData.reminder_date
  });

  return data.id;
}

/**
 * Update asset with value re-banding
 */
export async function updateAsset(
  assetId: string,
  updates: Partial<Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const { error } = await supabase
    .from('assets')
    .update(updates)
    .eq('id', assetId);

  if (error) throw error;

  // Record asset update
  await recordReceipt({
    type: 'AssetUpdate-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    asset_id: assetId,
    update_fields: Object.keys(updates),
    has_value_change: !!updates.current_value_band
  });
}

/**
 * Get assets dashboard summary
 */
export async function getAssetsSummary(): Promise<{
  total_assets: number;
  total_value_band: string;
  upcoming_reminders: number;
  pending_advice: number;
  by_type: Record<string, number>;
}> {
  const { data: assets, error } = await supabase
    .from('assets')
    .select('asset_type, current_value_band')
    .eq('status', 'active');

  if (error) throw error;

  const { data: reminders } = await supabase
    .from('asset_reminders')
    .select('id')
    .eq('status', 'pending')
    .gte('reminder_date', new Date().toISOString().split('T')[0]);

  const { data: advice } = await supabase
    .from('asset_advice')
    .select('id')
    .eq('status', 'open');

  const byType = (assets || []).reduce((acc, asset) => {
    acc[asset.asset_type] = (acc[asset.asset_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate aggregate value band (privacy-preserving)
  const totalValueBand = calculateAggregateValueBand(assets || []);

  return {
    total_assets: assets?.length || 0,
    total_value_band: totalValueBand,
    upcoming_reminders: reminders?.length || 0,
    pending_advice: advice?.length || 0,
    by_type: byType
  };
}

/**
 * Band file size for privacy
 */
function bandFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return 'under_1mb';        // < 1MB
  if (bytes < 10 * 1024 * 1024) return '1mb_10mb';    // 1-10MB
  if (bytes < 100 * 1024 * 1024) return '10mb_100mb'; // 10-100MB
  return 'over_100mb';                                 // > 100MB
}

/**
 * Calculate aggregate value band (privacy-preserving)
 */
function calculateAggregateValueBand(assets: any[]): string {
  // Map value bands to midpoint values for calculation
  const bandValues = {
    'under_100k': 50000,
    '100k_500k': 300000,
    '500k_1m': 750000,
    '1m_5m': 3000000,
    '5m_10m': 7500000,
    'over_10m': 15000000
  };

  const totalMidpoint = assets.reduce((sum, asset) => {
    const band = asset.current_value_band;
    return sum + (band ? bandValues[band] || 0 : 0);
  }, 0);

  // Return aggregate band
  if (totalMidpoint < 500000) return 'under_500k';
  if (totalMidpoint < 2000000) return '500k_2m';
  if (totalMidpoint < 10000000) return '2m_10m';
  if (totalMidpoint < 50000000) return '10m_50m';
  return 'over_50m';
}

/**
 * Get asset type display name
 */
export function getAssetTypeDisplay(type: string): string {
  const displays = {
    'home_high_value': 'High-Value Home',
    'exotic_auto': 'Exotic Auto',
    'marine_boat': 'Boat',
    'marine_yacht': 'Yacht',
    'rv': 'RV/Motorhome',
    'fine_art': 'Fine Art',
    'jewelry': 'Jewelry',
    'umbrella': 'Umbrella',
    'flood': 'Flood',
    'earthquake': 'Earthquake',
    'landlord_property': 'Rental Property',
    'entity_owned': 'Entity-Owned',
    'cyber': 'Cyber Liability',
    'kidnap_ransom': 'K&R'
  };
  return displays[type] || type;
}