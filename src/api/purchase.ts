import { TrialManager, TRIAL_CONFIGS } from '@/lib/trialManager';
import { track } from '@/lib/analytics';

// Purchase API stub
export async function POST(request: Request) {
  const body = await request.json();
  const { plan, persona, segment, featureKey, isTrialStart } = body;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Handle trial starts
  if (isTrialStart) {
    try {
      const trialConfig = {
        persona,
        plan,
        durationDays: persona === 'families' ? 14 : 7,
        segment
      };
      
      const trial = await TrialManager.startTrial(trialConfig);
      
      if (trial) {
        track('trial.start', {
          persona,
          segment: segment || 'general',
          plan,
          trial_duration_days: trialConfig.durationDays,
          trial_id: trial.id
        });

        return Response.json({
          success: true,
          trial: true,
          trialId: trial.id,
          plan,
          persona,
          segment,
          daysRemaining: trialConfig.durationDays,
          message: `${trialConfig.durationDays}-day ${plan} trial started successfully`
        });
      } else {
        return Response.json(
          { error: 'Trial already active or failed to start' },
          { status: 400 }
        );
      }
    } catch (error) {
      return Response.json(
        { error: 'Failed to start trial' },
        { status: 500 }
      );
    }
  }

  // Simulate success/failure based on plan
  if (plan === 'elite' && Math.random() < 0.2) {
    return Response.json(
      { error: 'Elite plan requires manual approval' },
      { status: 400 }
    );
  }

  // Track successful purchase
  track('plan.purchase_success', {
    persona: persona || 'unknown',
    segment: segment || 'general',
    plan,
    transaction_id: `tx_${Date.now()}`,
    feature_context: featureKey || null
  });

  // Simulate successful purchase
  return Response.json({
    success: true,
    plan,
    persona,
    segment,
    featureKey,
    transactionId: `tx_${Date.now()}`,
    message: `Successfully upgraded to ${plan} plan`,
  });
}