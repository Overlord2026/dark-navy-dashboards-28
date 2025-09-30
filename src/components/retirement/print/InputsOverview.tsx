import type { RetirementAnalysisInput } from '@/types/retirement';

interface InputsOverviewProps {
  inputs: Partial<RetirementAnalysisInput>;
}

export function InputsOverview({ inputs }: InputsOverviewProps) {
  return (
    <div className="page-break-before p-8">
      <h2 className="text-3xl font-bold mb-6">Inputs Overview</h2>
      
      {/* Retirement Goals */}
      {inputs.goals && (
        <section className="mb-8 page-break-avoid">
          <h3 className="text-xl font-semibold mb-3">Retirement Goals</h3>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 font-medium">Current Age</td>
                <td className="py-2">{inputs.goals.currentAge}</td>
                <td className="py-2 font-medium">Retirement Age</td>
                <td className="py-2">{inputs.goals.retirementAge}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Life Expectancy</td>
                <td className="py-2">{inputs.goals.lifeExpectancy}</td>
                <td className="py-2 font-medium">Desired Lifestyle</td>
                <td className="py-2 capitalize">{inputs.goals.desiredLifestyle}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Annual Income Need</td>
                <td className="py-2">${inputs.goals.annualRetirementIncome.toLocaleString()}</td>
                <td className="py-2 font-medium">Inflation Rate</td>
                <td className="py-2">{(inputs.goals.inflationRate * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
      
      {/* Investment Accounts */}
      {inputs.accounts && inputs.accounts.length > 0 && (
        <section className="mb-8 page-break-avoid">
          <h3 className="text-xl font-semibold mb-3">Investment Accounts</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Account Type</th>
                <th className="text-right py-2">Balance</th>
                <th className="text-right py-2">Annual Contribution</th>
                <th className="text-right py-2">Expected Return</th>
              </tr>
            </thead>
            <tbody>
              {inputs.accounts.map((acc, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 capitalize">{acc.type.replace(/_/g, ' ')}</td>
                  <td className="py-2 text-right">${acc.balance.toLocaleString()}</td>
                  <td className="py-2 text-right">${acc.annualContribution.toLocaleString()}</td>
                  <td className="py-2 text-right">{(acc.expectedReturn * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      
      {/* Expenses */}
      {inputs.expenses && inputs.expenses.length > 0 && (
        <section className="mb-8 page-break-avoid">
          <h3 className="text-xl font-semibold mb-3">Retirement Expenses</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Category</th>
                <th className="text-right py-2">Annual Amount</th>
                <th className="text-center py-2">Essential</th>
                <th className="text-center py-2">Inflation Protected</th>
              </tr>
            </thead>
            <tbody>
              {inputs.expenses.map((exp, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{exp.name}</td>
                  <td className="py-2 text-right">${exp.retirementAmount.toLocaleString()}</td>
                  <td className="py-2 text-center">{exp.essential ? '✓' : '—'}</td>
                  <td className="py-2 text-center">{exp.inflationProtected ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      
      {/* Social Security & Pension */}
      <section className="page-break-avoid">
        <h3 className="text-xl font-semibold mb-3">Guaranteed Income</h3>
        <div className="grid grid-cols-2 gap-6">
          {inputs.socialSecurity && inputs.socialSecurity.enabled && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Social Security</h4>
              <div className="space-y-1 text-sm">
                <div>Filing Age: {inputs.socialSecurity.filingAge}</div>
                <div>Current Earnings: ${inputs.socialSecurity.currentEarnings.toLocaleString()}</div>
                {inputs.socialSecurity.spousalBenefit && (
                  <div>Spousal Benefit: Yes</div>
                )}
              </div>
            </div>
          )}
          
          {inputs.pension && inputs.pension.enabled && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Pension</h4>
              <div className="space-y-1 text-sm">
                <div>Monthly Benefit: ${inputs.pension.monthlyBenefit.toLocaleString()}</div>
                <div>Start Age: {inputs.pension.startAge}</div>
                {inputs.pension.colaProtection && (
                  <div>COLA Protection: Yes</div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
