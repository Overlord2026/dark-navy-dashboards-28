/**
 * IAR Micro-Site Builder Service
 * Creates brand-safe sites with compliance injections
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { inputs_hash } from '@/lib/canonical';

export interface SiteBlock {
  type: 'hero' | 'bio' | 'services' | 'fees' | 'disclosures' | 'contact';
  content: Record<string, any>;
  order: number;
  enabled: boolean;
}

export interface MicroSite {
  id: string;
  iar_id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  blocks: SiteBlock[];
  compliance_version: string;
  published_at?: string;
  analytics_enabled: boolean;
}

/**
 * Creates a new micro-site draft
 */
export async function createSite(iarId: string, title: string, slug: string): Promise<string> {
  const defaultBlocks: SiteBlock[] = [
    {
      type: 'hero',
      content: { headline: '', subline: '', cta_text: 'Learn More' },
      order: 1,
      enabled: true
    },
    {
      type: 'bio',
      content: { bio_text: '', credentials: [], experience_years: 0 },
      order: 2,
      enabled: true
    },
    {
      type: 'services',
      content: { services: [], specialties: [] },
      order: 3,
      enabled: true
    },
    {
      type: 'fees',
      content: { fee_structure: 'transparent', fee_ranges: [] },
      order: 4,
      enabled: true
    },
    {
      type: 'disclosures',
      content: { auto_injected: true, compliance_version: 'v2024.1' },
      order: 5,
      enabled: true
    },
    {
      type: 'contact',
      content: { phone: '', email: '', address: '', calendar_link: '' },
      order: 6,
      enabled: true
    }
  ];

  const { data, error } = await supabase
    .from('iar_sites')
    .insert({
      iar_id: iarId,
      slug,
      title,
      status: 'draft',
      blocks: defaultBlocks,
      compliance_version: 'v2024.1',
      analytics_enabled: true
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

/**
 * Updates site blocks with content-free receipt
 */
export async function updateSiteBlocks(siteId: string, blocks: SiteBlock[]): Promise<void> {
  // Create content-free version for receipt
  const blocksHash = await inputs_hash({
    site_id: siteId,
    blocks_count: blocks.length,
    enabled_blocks: blocks.filter(b => b.enabled).length,
    compliance_version: 'v2024.1'
  });

  const { error } = await supabase
    .from('iar_sites')
    .update({ blocks, updated_at: new Date().toISOString() })
    .eq('id', siteId);

  if (error) throw error;

  // Record site update
  await recordReceipt({
    type: 'SiteUpdate-RDS',
    ts: new Date().toISOString(),
    site_id: siteId,
    blocks_hash: blocksHash,
    policy_version: 'v1.0'
  });
}

/**
 * Publishes a site with compliance injection
 */
export async function publishSite(siteId: string): Promise<void> {
  const { data: site, error: fetchError } = await supabase
    .from('iar_sites')
    .select('*')
    .eq('id', siteId)
    .single();

  if (fetchError) throw fetchError;

  // Inject mandatory disclosures
  const blocks = (site as any).blocks.map((block: SiteBlock) => {
    if (block.type === 'disclosures') {
      return {
        ...block,
        content: {
          ...block.content,
          auto_injected: true,
          finra_disclosure: 'Securities offered through [Broker-Dealer Name], Member FINRA/SIPC.',
          ria_disclosure: 'Advisory services offered through [RIA Name], a Registered Investment Advisor.',
          compliance_version: 'v2024.1',
          last_updated: new Date().toISOString()
        }
      };
    }
    return block;
  });

  const { error: updateError } = await supabase
    .from('iar_sites')
    .update({
      blocks,
      status: 'published',
      published_at: new Date().toISOString(),
      compliance_version: 'v2024.1'
    })
    .eq('id', siteId);

  if (updateError) throw updateError;

  // Record publish receipts
  const publishHash = await inputs_hash({
    site_id: siteId,
    compliance_version: 'v2024.1',
    publish_timestamp: new Date().toISOString()
  });

  await Promise.all([
    recordReceipt({
      type: 'Publish-RDS',
      ts: new Date().toISOString(),
      site_id: siteId,
      publish_hash: publishHash,
      policy_version: 'v1.0'
    }),
    recordReceipt({
      type: 'Rules-Export-RDS',
      ts: new Date().toISOString(),
      site_id: siteId,
      rules_hash: await inputs_hash({ disclosures: 'auto_injected', compliance: 'v2024.1' }),
      policy_version: 'v1.0'
    })
  ]);
}

/**
 * Records site access (public view) with content-free receipt
 */
export async function recordSiteAccess(slug: string, visitorInfo: {
  ip_hash: string;
  user_agent_hash: string;
  referrer_hash?: string;
}): Promise<void> {
  const accessHash = await inputs_hash({
    slug,
    ...visitorInfo,
    timestamp: new Date().toISOString()
  });

  await recordReceipt({
    type: 'Access-RDS',
    ts: new Date().toISOString(),
    site_slug: slug,
    access_hash: accessHash,
    policy_version: 'v1.0'
  });
}

/**
 * Gets published site by slug for public viewing
 */
export async function getPublishedSite(slug: string): Promise<MicroSite | null> {
  const { data, error } = await supabase
    .from('iar_sites')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data as unknown as MicroSite;
}

/**
 * Lists sites for IAR admin
 */
export async function listSites(iarId: string): Promise<MicroSite[]> {
  const { data, error } = await supabase
    .from('iar_sites')
    .select('*')
    .eq('iar_id', iarId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as MicroSite[];
}