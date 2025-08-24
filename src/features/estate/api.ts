// Mock estate intent API
export async function getEstateIntent(clientId: string) {
  // Mock estate intent data
  return {
    accountIntent: {
      'account-1': 'spouse',
      'account-2': 'children',
      'account-3': 'trust'
    }
  };
}

// Mock accounts with beneficiaries API
export async function listAccountsWithBeneficiaries(clientId: string) {
  // Mock account data with current beneficiaries
  return [
    { accountId: 'account-1', currentBeneficiary: 'spouse' },
    { accountId: 'account-2', currentBeneficiary: 'estate' }, // Mismatch
    { accountId: 'account-3', currentBeneficiary: 'trust' }
  ];
}