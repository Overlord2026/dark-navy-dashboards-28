
import { InsurancePolicy, HealthInsurancePolicy, PropertyInsurancePolicy, UmbrellaInsurancePolicy, AutoInsurancePolicy, LifeInsurancePolicy } from "@/types/insurance";

export const mockLifePolicies: LifeInsurancePolicy[] = [
  {
    id: "life-001",
    name: "Term Life Policy",
    provider: "Guardian Life",
    type: "term-life",
    premium: 750,
    coverage: 500000,
    status: "active",
    policyNumber: "GL-12345-TL",
    startDate: "2023-01-15",
    endDate: "2043-01-15",
    renewalDate: "2024-01-15",
    documents: ["policy_document.pdf", "beneficiary_form.pdf"],
    beneficiaries: "Spouse (Primary), Children (Contingent)", // Changed from array to string
    deathBenefit: 500000,
    policyType: "term",
    termLength: 20
  },
  {
    id: "life-002",
    name: "Whole Life Policy",
    provider: "Northwestern Mutual",
    type: "permanent-life",
    premium: 3200,
    coverage: 1000000,
    status: "active",
    policyNumber: "NWM-78901-WL",
    startDate: "2020-06-10",
    endDate: "",
    renewalDate: "2024-06-10",
    documents: ["policy_document.pdf", "cash_value_statement.pdf"],
    beneficiaries: "Spouse (50%), Trust (50%)", // Changed from array to string
    deathBenefit: 1000000,
    policyType: "whole",
    cashValue: 45000
  }
];

export const mockHealthPolicies: HealthInsurancePolicy[] = [
  {
    id: "health-001",
    name: "Family PPO Plan",
    provider: "Blue Cross Blue Shield",
    type: "health",
    premium: 950,
    coverage: 1000000,
    status: "active",
    policyNumber: "BCBS-123456-H",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    renewalDate: "2024-12-01",
    documents: ["health_policy.pdf", "prescription_coverage.pdf"],
    deductible: 2500,
    coInsurance: 20,
    outOfPocketMax: 8000,
    coverageType: "family",
    network: "Preferred Provider"
  }
];

export const mockPropertyPolicies: (PropertyInsurancePolicy | AutoInsurancePolicy)[] = [
  {
    id: "prop-001",
    name: "Primary Residence Policy",
    provider: "State Farm",
    type: "homeowners",
    premium: 2100,
    coverage: 750000,
    status: "active",
    policyNumber: "SF-56789-H",
    startDate: "2024-02-15",
    endDate: "2025-02-15",
    renewalDate: "2025-01-15",
    documents: ["homeowners_policy.pdf", "property_inventory.pdf"],
    propertyAddress: "123 Main Street, Austin, TX 78701",
    propertyType: "Single Family Home",
    deductible: 5000,
    liabilityCoverage: 300000,
    personalPropertyCoverage: 250000
  },
  {
    id: "auto-001",
    name: "Primary Vehicle Policy",
    provider: "GEICO",
    type: "auto",
    premium: 1200,
    coverage: 300000,
    status: "active",
    policyNumber: "GEICO-34567-A",
    startDate: "2024-03-01",
    endDate: "2025-03-01",
    renewalDate: "2025-02-01",
    documents: ["auto_policy.pdf", "proof_of_insurance.pdf"],
    vehicle: {
      make: "Toyota",
      model: "Highlander",
      year: 2022,
      vin: "1HGCM82633A123456"
    },
    liabilityCoverage: 300000,
    collisionDeductible: 500,
    comprehensiveDeductible: 250
  }
];

export const mockUmbrellaPolicies: UmbrellaInsurancePolicy[] = [
  {
    id: "umb-001",
    name: "Personal Umbrella Policy",
    provider: "Travelers",
    type: "umbrella",
    premium: 600,
    coverage: 2000000,
    status: "active",
    policyNumber: "TRV-98765-U",
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    renewalDate: "2024-12-01",
    documents: ["umbrella_policy.pdf"],
    coverageLimit: 2000000,
    underlyingPolicies: ["auto-001", "prop-001"],
    deductible: 0
  }
];

export const getAllMockInsurancePolicies = (): InsurancePolicy[] => {
  return [
    ...mockLifePolicies as unknown as InsurancePolicy[],
    ...mockHealthPolicies,
    ...mockPropertyPolicies as unknown as InsurancePolicy[],
    ...mockUmbrellaPolicies
  ];
};
