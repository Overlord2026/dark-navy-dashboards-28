/**
 * Adapter for NIL-specific scheduling features
 * Handles NIL compliance, training requirements, and athlete-specific flows
 */

import { supabase } from "@/integrations/supabase/client";
import type { OfferingFormData, WindowFormData, BookingFormData } from '../schedulerApi';

export const nilAdapter = {
  // Check if athlete can publish offerings
  async checkPublishEligibility(athleteUserId: string) {
    try {
      // Check for required NIL disclosures
      const { data: disclosures, error: disclosureError } = await supabase
        .from('nil_disclosures')
        .select('*')
        .eq('athlete_user_id', athleteUserId)
        .eq('is_signed', true)
        .maybeSingle();

      if (disclosureError) throw disclosureError;

      // Check for required NIL training
      const { data: training, error: trainingError } = await supabase
        .from('nil_training_status')
        .select('*')
        .eq('athlete_user_id', athleteUserId)
        .eq('module', 'nil_core')
        .eq('status', 'completed')
        .maybeSingle();

      if (trainingError) throw trainingError;

      const hasDisclosure = !!disclosures;
      const hasTraining = !!training;
      const canPublish = hasDisclosure && hasTraining;

      let blockReason = '';
      if (!hasDisclosure && !hasTraining) {
        blockReason = 'Complete NIL training and sign disclosure documents to publish offerings';
      } else if (!hasDisclosure) {
        blockReason = 'Sign NIL disclosure documents to publish offerings';
      } else if (!hasTraining) {
        blockReason = 'Complete NIL core training to publish offerings';
      }

      return {
        canPublish,
        blockReason,
        hasDisclosure,
        hasTraining
      };
    } catch (error) {
      console.error('Error checking publish eligibility:', error);
      return {
        canPublish: false,
        blockReason: 'Unable to verify NIL compliance status',
        hasDisclosure: false,
        hasTraining: false
      };
    }
  },

  // Create NIL-specific offering with compliance checks
  async createNILOffering(athleteUserId: string, offering: OfferingFormData) {
    const eligibility = await this.checkPublishEligibility(athleteUserId);
    
    if (offering.is_published && !eligibility.canPublish) {
      throw new Error(eligibility.blockReason);
    }

    // Add NIL-specific metadata
    const nilOffering = {
      ...offering,
      metadata: {
        nil_compliant: eligibility.canPublish,
        requires_age_verification: true,
        requires_terms_agreement: true,
        athlete_verified: true
      }
    };

    return nilOffering;
  },

  // Validate NIL booking requirements
  async validateNILBooking(booking: BookingFormData) {
    if (!booking.confirmed_adult) {
      throw new Error('Age verification required for NIL sessions');
    }

    if (!booking.agreed_to_terms) {
      throw new Error('Agreement to NIL terms required');
    }

    return true;
  },

  // Get athlete profile for public display
  async getAthleteProfile(athleteUserId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', athleteUserId)
        .single();

      if (error) throw error;

      // Only return public information
      return {
        id: profile.id,
        display_name: profile.display_name,
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        sport: (profile as any).sport || '',
        school: (profile as any).school || '',
        graduation_year: (profile as any).graduation_year || null
      };
    } catch (error) {
      console.error('Error fetching athlete profile:', error);
      return null;
    }
  },

  // Generate athlete slug for public URLs
  generateAthleteSlug(profile: any): string {
    if (!profile) return '';
    
    const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    const sport = profile.sport || '';
    const school = profile.school || '';
    
    const slugParts = [name, sport, school].filter(Boolean);
    return slugParts
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
};