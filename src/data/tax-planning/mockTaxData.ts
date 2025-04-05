
// Mock data for tax planning
import { TaxStrategy, TaxDeduction, TaxDeadline } from '../../types/taxTypes';

export const taxStrategies: TaxStrategy[] = [
  {
    id: '1',
    title: 'Maximize Retirement Contributions',
    description: 'Contribute the maximum allowed amount to your retirement accounts to reduce taxable income.',
    potentialSavings: '5,000 - 10,000',
    complexity: 'Low',
    applicableFilingStatus: ['Single', 'Married Filing Jointly', 'Head of Household'],
    incomeRange: { min: 50000, max: null }
  },
  {
    id: '2',
    title: 'Tax-Loss Harvesting',
    description: 'Offset capital gains by selling investments at a loss to reduce tax liability.',
    potentialSavings: '1,000 - 5,000',
    complexity: 'Medium',
    applicableFilingStatus: ['Single', 'Married Filing Jointly'],
    incomeRange: { min: 100000, max: null }
  },
  {
    id: '3',
    title: 'Donor-Advised Fund',
    description: 'Bundle multiple years of charitable contributions into a single year to exceed the standard deduction threshold.',
    potentialSavings: '3,000 - 15,000',
    complexity: 'Medium',
    applicableFilingStatus: ['Married Filing Jointly'],
    incomeRange: { min: 150000, max: null }
  },
  {
    id: '4',
    title: 'Qualified Business Income Deduction',
    description: 'Take advantage of the 20% pass-through deduction for qualified business income.',
    potentialSavings: '10,000 - 50,000',
    complexity: 'High',
    applicableFilingStatus: ['Single', 'Married Filing Jointly', 'Head of Household'],
    incomeRange: { min: 75000, max: 426600 }
  },
  {
    id: '5',
    title: 'Tax-Advantaged Education Accounts',
    description: 'Contribute to 529 plans or Coverdell ESAs to save for education expenses with tax advantages.',
    potentialSavings: '1,000 - 5,000',
    complexity: 'Low',
    applicableFilingStatus: ['Single', 'Married Filing Jointly', 'Head of Household'],
    incomeRange: { min: 50000, max: null }
  }
];

export const taxDeductions: TaxDeduction[] = [
  {
    id: '1',
    name: 'Mortgage Interest',
    description: 'Deduct interest paid on home mortgages up to $750,000 of debt.',
    maxDeduction: 'Interest on up to $750,000 of mortgage debt',
    eligibility: 'Homeowners with a mortgage',
    documentationNeeded: ['Mortgage interest statement (Form 1098)', 'Proof of payments']
  },
  {
    id: '2',
    name: 'Charitable Contributions',
    description: 'Deduct donations to qualified charitable organizations.',
    maxDeduction: 'Up to 60% of adjusted gross income',
    eligibility: 'Must itemize deductions',
    documentationNeeded: ['Receipts for donations', 'Acknowledgement letters for donations over $250']
  },
  {
    id: '3',
    name: 'State and Local Taxes (SALT)',
    description: 'Deduct state and local income or sales taxes, and property taxes.',
    maxDeduction: 'Limited to $10,000',
    eligibility: 'Must itemize deductions',
    documentationNeeded: ['Property tax statements', 'State tax returns', 'Sales tax receipts']
  },
  {
    id: '4',
    name: 'Medical Expenses',
    description: 'Deduct qualifying medical expenses that exceed 7.5% of your adjusted gross income.',
    maxDeduction: 'Expenses exceeding 7.5% of AGI',
    eligibility: 'Must itemize deductions',
    documentationNeeded: ['Medical bills', 'Insurance statements', 'Receipts for medical expenses']
  },
  {
    id: '5',
    name: 'Student Loan Interest',
    description: 'Deduct interest paid on student loans up to $2,500.',
    maxDeduction: 'Up to $2,500',
    eligibility: 'Income must be below $85,000 (single) or $170,000 (joint)',
    documentationNeeded: ['Form 1098-E from loan servicer']
  },
  {
    id: '6',
    name: 'Home Office Deduction',
    description: 'Deduct expenses related to using part of your home exclusively for business.',
    maxDeduction: 'Varies based on home size and expenses',
    eligibility: 'Self-employed individuals who use part of their home exclusively for business',
    documentationNeeded: ['Home expenses records', 'Measurements of office space vs. total home']
  },
  {
    id: '7',
    name: 'Health Savings Account (HSA) Contributions',
    description: 'Deduct contributions to an HSA if you have a high-deductible health plan.',
    maxDeduction: 'Up to $3,650 for individuals, $7,300 for families (2022)',
    eligibility: 'Must have a high-deductible health plan',
    documentationNeeded: ['HSA contribution statements', 'Form 5498-SA']
  },
  {
    id: '8',
    name: 'IRA Contributions',
    description: 'Deduct contributions to a traditional IRA.',
    maxDeduction: 'Up to $6,000 ($7,000 if 50 or older)',
    eligibility: 'Income and retirement plan restrictions apply',
    documentationNeeded: ['IRA contribution receipts', 'Form 5498']
  }
];

export const taxDeadlines = [
  {
    id: '1',
    title: 'Federal Tax Return Filing',
    dueDate: '2023-04-18',
    description: 'Deadline for filing individual federal tax returns for tax year 2022.',
    lateFilingPenalty: '5% of unpaid taxes each month, up to 25%',
    extensions: 'Form 4868 can extend deadline to October 16'
  },
  {
    id: '2',
    title: 'Q1 Estimated Tax Payment',
    dueDate: '2023-04-18',
    description: 'First quarter estimated tax payment for tax year 2023.',
    lateFilingPenalty: 'Varies based on amount owed and timing',
    extensions: 'No extensions available'
  },
  {
    id: '3',
    title: 'Q2 Estimated Tax Payment',
    dueDate: '2023-06-15',
    description: 'Second quarter estimated tax payment for tax year 2023.',
    lateFilingPenalty: 'Varies based on amount owed and timing',
    extensions: 'No extensions available'
  },
  {
    id: '4',
    title: 'Q3 Estimated Tax Payment',
    dueDate: '2023-09-15',
    description: 'Third quarter estimated tax payment for tax year 2023.',
    lateFilingPenalty: 'Varies based on amount owed and timing',
    extensions: 'No extensions available'
  },
  {
    id: '5',
    title: 'Extended Tax Return Filing',
    dueDate: '2023-10-16',
    description: 'Deadline for filing individual tax returns if an extension was requested.',
    lateFilingPenalty: '5% of unpaid taxes each month, up to 25%',
    extensions: 'No further extensions available'
  },
  {
    id: '6',
    title: 'Q4 Estimated Tax Payment',
    dueDate: '2024-01-16',
    description: 'Fourth quarter estimated tax payment for tax year 2023.',
    lateFilingPenalty: 'Varies based on amount owed and timing',
    extensions: 'No extensions available'
  }
];

export const taxBrackets = {
  single: [
    { rate: 10, min: 0, max: 10275 },
    { rate: 12, min: 10276, max: 41775 },
    { rate: 22, min: 41776, max: 89075 },
    { rate: 24, min: 89076, max: 170050 },
    { rate: 32, min: 170051, max: 215950 },
    { rate: 35, min: 215951, max: 539900 },
    { rate: 37, min: 539901, max: null }
  ],
  marriedJoint: [
    { rate: 10, min: 0, max: 20550 },
    { rate: 12, min: 20551, max: 83550 },
    { rate: 22, min: 83551, max: 178150 },
    { rate: 24, min: 178151, max: 340100 },
    { rate: 32, min: 340101, max: 431900 },
    { rate: 35, min: 431901, max: 647850 },
    { rate: 37, min: 647851, max: null }
  ],
  headOfHousehold: [
    { rate: 10, min: 0, max: 14650 },
    { rate: 12, min: 14651, max: 55900 },
    { rate: 22, min: 55901, max: 89050 },
    { rate: 24, min: 89051, max: 170050 },
    { rate: 32, min: 170051, max: 215950 },
    { rate: 35, min: 215951, max: 539900 },
    { rate: 37, min: 539901, max: null }
  ]
};
