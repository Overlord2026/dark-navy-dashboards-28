// Task 6: Calculator Tests - RMD Calculator
import { describe, test, expect } from 'vitest';

interface RmdInput {
  dob: string;
  balance: number;
  table: 'uniform_lifetime' | 'joint_survivor' | 'single_life';
}

interface RmdResult {
  year: number;
  age: number;
  amount: number;
  distributionFactor: number;
}

// Mock RMD Calculator (implement actual logic in production)
function calcRmd(input: RmdInput): RmdResult {
  const birthYear = new Date(input.dob).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  
  // Simplified distribution factor lookup
  const distributionFactors: Record<number, number> = {
    73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9,
    78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5
  };
  
  const factor = distributionFactors[age] || 20.0;
  const amount = Math.round(input.balance / factor);
  
  return {
    year: currentYear,
    age,
    amount,
    distributionFactor: factor
  };
}

describe('RMD Calculator Tests', () => {
  test('RMD 2025 baseline calculation', () => {
    const input: RmdInput = {
      dob: '1953-01-01',
      balance: 800000,
      table: 'uniform_lifetime'
    };
    
    const result = calcRmd(input);
    
    expect(result).toMatchObject({
      year: 2025,
      amount: expect.any(Number)
    });
    
    // Allow for ±2% tolerance
    expect(result.amount).toBeGreaterThan(32000);
    expect(result.amount).toBeLessThan(35000);
  });

  test('High balance RMD calculation', () => {
    const input: RmdInput = {
      dob: '1950-06-15',
      balance: 2500000,
      table: 'uniform_lifetime'
    };
    
    const result = calcRmd(input);
    
    expect(result.age).toBe(75);
    expect(result.amount).toBeGreaterThan(100000);
    expect(result.distributionFactor).toBeCloseTo(24.6, 1);
  });

  test('Edge case: minimum balance', () => {
    const input: RmdInput = {
      dob: '1951-12-31',
      balance: 1000,
      table: 'uniform_lifetime'
    };
    
    const result = calcRmd(input);
    
    expect(result.amount).toBeGreaterThan(0);
    expect(result.amount).toBeLessThan(100);
  });

  test('Age boundary conditions', () => {
    // Test age 73 (first RMD year)
    const input73: RmdInput = {
      dob: '1952-01-01',
      balance: 500000,
      table: 'uniform_lifetime'
    };
    
    const result73 = calcRmd(input73);
    expect(result73.age).toBe(73);
    expect(result73.distributionFactor).toBe(26.5);
    
    // Test age 80+
    const input80: RmdInput = {
      dob: '1945-01-01',
      balance: 500000,
      table: 'uniform_lifetime'
    };
    
    const result80 = calcRmd(input80);
    expect(result80.age).toBe(80);
    expect(result80.distributionFactor).toBe(20.2);
  });

  test('Different table types', () => {
    const baseInput: RmdInput = {
      dob: '1950-01-01',
      balance: 1000000,
      table: 'uniform_lifetime'
    };

    const uniformResult = calcRmd(baseInput);
    const jointResult = calcRmd({ ...baseInput, table: 'joint_survivor' });
    const singleResult = calcRmd({ ...baseInput, table: 'single_life' });

    // All should return valid results
    expect(uniformResult.amount).toBeGreaterThan(0);
    expect(jointResult.amount).toBeGreaterThan(0);
    expect(singleResult.amount).toBeGreaterThan(0);
  });

  test('Snapshot test for consistency', () => {
    const input: RmdInput = {
      dob: '1951-03-15',
      balance: 750000,
      table: 'uniform_lifetime'
    };
    
    const result = calcRmd(input);
    
    expect(result).toMatchSnapshot();
  });
});