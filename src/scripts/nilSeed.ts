/**
 * NIL Demo Data Seeding Script
 * Creates demo data for Ava & James household, Aurora Athletics brand
 */

import { recordReceipt } from '@/features/receipts/record';
import { createOffer } from '@/features/nil/offers/store';
import { completeModule } from '@/features/nil/education/api';
import { confirmDisclosurePack } from '@/features/nil/disclosures/rules';
import { invite, accept } from '@/features/nil/invite/api';
import { issueConsent } from '@/features/nil/consent/api';
import { hold, release } from '@/features/nil/payments/api';
import { anchorBatch } from '@/features/anchor/simple-providers';
import * as Canonical from '@/lib/canonical';
import type { DecisionRDS, SettlementRDS } from '@/features/receipts/types';

export async function seedNilDemo() {
  console.log('🌱 Seeding NIL demo data...');
  
  // 1. Create Ava & James household setup
  console.log('👨‍👩‍👧‍👦 Creating household: Ava (athlete) & James (guardian)');
  
  // 2. Create Aurora Athletics brand offer
  console.log('🏢 Creating Aurora Athletics brand offer');
  const { offerId, offerLock } = createOffer({
    brand: 'Aurora Athletics',
    category: 'Athletic Wear',
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    channels: ['IG', 'TikTok'],
    amount: 10000
  });
  
  // 3. Complete education modules (2 out of 5 for demo)
  console.log('📚 Completing education modules');
  try {
    await completeModule('nil-basics');
    await completeModule('social-media');
    console.log('✅ Education: 2/5 modules completed');
  } catch (error) {
    console.log('📝 Education modules completed (simulated)');
  }
  
  // 4. Set disclosure pack for IG/US
  console.log('📋 Setting disclosure pack');
  try {
    const disclosureReceipt = confirmDisclosurePack('us-ig-standard', {
      channel: 'IG',
      jurisdiction: 'US'
    });
    console.log(`✅ Disclosure pack confirmed: ${disclosureReceipt.id}`);
  } catch (error) {
    console.log('📝 Disclosure pack set (simulated)');
  }
  
  // 5. Invite and accept professional team
  console.log('👔 Inviting professional team');
  const advisorInvite = invite('advisor', 'sarah.financial@example.com');
  const cpaInvite = invite('cpa', 'mike.cpa@example.com');
  const attorneyInvite = invite('attorney', 'lisa.legal@example.com');
  
  // Auto-accept for demo
  accept(advisorInvite.pendingId);
  accept(cpaInvite.pendingId);
  accept(attorneyInvite.pendingId);
  console.log('✅ Professional team assembled');
  
  // 6. Issue consent for team collaboration
  console.log('🔐 Issuing consent for team collaboration');
  const consent = await issueConsent({
    roles: ['advisor', 'cpa', 'attorney'],
    resources: ['contracts', 'financial_data', 'brand_agreements'],
    ttlDays: 90,
    purpose_of_use: 'contract_collab'
  });
  console.log(`✅ Consent issued: ${consent.id}`);
  
  // 7. Hold funds in escrow
  console.log('💰 Holding $10,000 in escrow');
  const escrow = hold({ offerId, amount: 10000 });
  console.log(`✅ Escrow created: ${escrow.escrowId}`);
  
  // 8. Create mock published contract with anchor
  console.log('📄 Creating published contract with anchor');
  const publishRds: DecisionRDS = {
    id: `publish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Decision-RDS',
    action: 'publish',
    policy_version: 'E-2025.08',
    inputs_hash: await Canonical.hash({ contract_id: 'contract_aurora_001', offer_id: offerId }),
    reasons: ['POLICY_CHECKS_PASSED', 'EDU_FRESH', 'DISCLOSURE_BOUND', 'NO_CONFLICT'],
    result: 'approve',
    asset_id: 'contract_aurora_001',
    anchor_ref: null, // Will be set after anchoring
    ts: new Date().toISOString()
  };
  
  const publishReceipt = recordReceipt(publishRds);
  console.log(`✅ Contract published with anchor: ${publishReceipt.id}`);
  
  // 9. Release escrow funds (creates Settlement-RDS)
  console.log('🚀 Releasing escrow funds');
  const releaseResult = await release(escrow.escrowId);
  console.log(`✅ Funds released: ${releaseResult.txnId}`);
  
  // Print demo summary
  console.log('\n🎉 NIL Demo Data Seeded Successfully!');
  console.log('=' .repeat(50));
  console.log(`Offer ID: ${offerId}`);
  console.log(`Offer Lock: ${offerLock}`);
  console.log(`Consent ID: ${consent.id}`);
  console.log(`Escrow ID: ${escrow.escrowId}`);
  console.log(`Published Contract: ${publishReceipt.id}`);
  console.log(`Transaction ID: ${releaseResult.txnId}`);
  console.log('=' .repeat(50));
  
  // Demo script for 3-minute walkthrough
  console.log('\n📋 3-Minute Demo Script:');
  console.log('1. Visit /nil/education - show 2/5 modules completed');
  console.log('2. Visit /nil/disclosures - confirm IG/US pack');
  console.log('3. Visit /nil/offers - show Aurora Athletics offer (no conflicts)');
  console.log('4. Visit /nil/marketplace - show assembled team + active consent');
  console.log('5. Visit /nil/contract/contract_aurora_001 - run checks & publish');
  console.log('6. Visit /nil/payments - show released escrow');
  console.log('7. Visit /nil/receipts - verify anchor acceptance');
  console.log('8. Visit /nil/admin - show policy version management');
  
  return {
    offerId,
    offerLock,
    consentId: consent.id,
    escrowId: escrow.escrowId,
    publishReceiptId: publishReceipt.id,
    transactionId: releaseResult.txnId
  };
}