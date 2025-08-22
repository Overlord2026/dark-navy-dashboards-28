export interface SolutionConfig {
  key: string;
  label: string;
  route: string;
}

export const SOLUTIONS_CONFIG: SolutionConfig[] = [
  {
    key: "insurance",
    label: "Insurance",
    route: "/solutions/insurance"
  },
  {
    key: "annuities",
    label: "Annuities",
    route: "/solutions/annuities"
  },
  {
    key: "lending",
    label: "Lending",
    route: "/solutions/lending"
  },
  {
    key: "investments",
    label: "Investments",
    route: "/solutions/investments"
  },
  {
    key: "tax",
    label: "Tax Planning",
    route: "/solutions/tax"
  },
  {
    key: "estate",
    label: "Estate Planning",
    route: "/solutions/estate"
  }
];

export const getSolutionByKey = (key: string) => 
  SOLUTIONS_CONFIG.find(s => s.key === key);