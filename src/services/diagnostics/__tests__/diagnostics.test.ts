
import { testAccounts, testTransactions } from '../accountTests';
import { testNavigation } from '../navigationTests';
import { testPerformance } from '../performanceTests';
import { testAccess } from '../accessTests';

describe('Diagnostic Tests', () => {
  test('Account tests return results', async () => {
    const results = await testAccounts();
    expect(Array.isArray(results)).toBe(true);
  });

  test('Navigation tests return results', async () => {
    const results = await testNavigation();
    expect(Array.isArray(results)).toBe(true);
  });

  test('Performance tests return results', async () => {
    const results = await testPerformance();
    expect(Array.isArray(results)).toBe(true);
  });

  test('Access tests return results', async () => {
    const results = await testAccess();
    expect(Array.isArray(results)).toBe(true);
  });
});
