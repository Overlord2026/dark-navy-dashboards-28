import { supabase } from "@/integrations/supabase/client";
import { schedulerApi } from "../schedulerApi";

// NIL (Name, Image, Likeness) compliance adapter for athletes
export const nilAdapter = {
  // Validate if athlete can publish content based on compliance requirements
  async checkPublishEligibility(athleteUserId: string): Promise<{
    canPublish: boolean;
    blockReason?: string;
    hasTraining: boolean;
    hasDisclosure: boolean;
  }> {
    try {
      // Check if athlete has completed NIL training
      const { data: trainingData } = await supabase
        .from('athlete_nil_training')
        .select('completed_at')
        .eq('athlete_id', athleteUserId)
        .single();

      // Check if athlete has signed disclosures
      const { data: disclosureData } = await supabase
        .from('athlete_nil_disclosures')
        .select('signed_at')
        .eq('athlete_id', athleteUserId)
        .single();

      const hasTraining = !!trainingData?.completed_at;
      const hasDisclosure = !!disclosureData?.signed_at;
      const canPublish = hasTraining && hasDisclosure;

      let blockReason;
      if (!hasTraining && !hasDisclosure) {
        blockReason = 'Complete NIL training and sign disclosure agreements';
      } else if (!hasTraining) {
        blockReason = 'Complete NIL training requirements';
      } else if (!hasDisclosure) {
        blockReason = 'Sign NIL disclosure agreements';
      }

      return {
        canPublish,
        blockReason,
        hasTraining,
        hasDisclosure
      };
    } catch (error) {
      console.error('Error checking publish eligibility:', error);
      return {
        canPublish: false,
        blockReason: 'Unable to verify eligibility',
        hasTraining: false,
        hasDisclosure: false
      };
    }
  },

  // Get athlete offering validation data
  async getAthleteOfferingValidation(athleteUserId: string): Promise<any[]> {
    try {
      const offerings = await schedulerApi.getOfferings(athleteUserId);
      return offerings || [];
    } catch (error) {
      console.error('Error getting athlete offerings:', error);
      return [];
    }
  },

  // Get athlete booking data for compliance reporting
  async getAthleteBookings(athleteUserId: string): Promise<any[]> {
    try {
      const bookings = await schedulerApi.getBookings(athleteUserId);
      return bookings || [];
    } catch (error) {
      console.error('Error getting athlete bookings:', error);
      return [];
    }
  },

  // Create NIL-specific offering with compliance checks
  async createNILOffering(athleteUserId: string, offering: any) {
    const eligibility = await this.checkPublishEligibility(athleteUserId);
    
    if (offering.is_published && !eligibility.canPublish) {
      throw new Error(eligibility.blockReason || 'Cannot publish offering');
    }

    // Add NIL-specific metadata
    return {
      ...offering,
      metadata: {
        nil_compliant: true,
        requires_age_verification: true,
        requires_terms_agreement: true,
        athlete_verified: eligibility.canPublish,
      }
    };
  },

  // Validate NIL booking requirements
  async validateNILBooking(booking: any) {
    if (!booking.confirmed_adult) {
      throw new Error('Age verification required for NIL sessions');
    }

    if (!booking.agreed_to_terms) {
      throw new Error('Terms agreement required for NIL sessions');
    }

    return true;
  }
};