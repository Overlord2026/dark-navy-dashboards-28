// Purchase API stub
export async function POST(request: Request) {
  const body = await request.json();
  const { plan, persona, segment, featureKey } = body;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate success/failure based on plan
  if (plan === 'elite' && Math.random() < 0.2) {
    return Response.json(
      { error: 'Elite plan requires manual approval' },
      { status: 400 }
    );
  }

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