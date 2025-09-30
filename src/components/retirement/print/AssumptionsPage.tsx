export function AssumptionsPage() {
  return (
    <div className="page-break-before p-8">
      <h2 className="text-3xl font-bold mb-6">Assumptions & Methodology</h2>
      
      <section className="mb-6 page-break-avoid">
        <h3 className="text-xl font-semibold mb-3">Monte Carlo Simulation</h3>
        <div className="space-y-2 text-sm">
          <p>
            The analysis uses Monte Carlo simulation with <strong>5,000 randomized scenarios</strong> to 
            estimate the probability of retirement success. Each scenario models different market conditions, 
            inflation rates, and longevity outcomes over your retirement horizon.
          </p>
          <p>
            The simulation considers sequence-of-returns risk, which is particularly important in early retirement. 
            Poor market performance in the first few years can have outsized impacts on long-term sustainability.
          </p>
        </div>
      </section>
      
      <section className="mb-6 page-break-avoid">
        <h3 className="text-xl font-semibold mb-3">Return Assumptions</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Asset Class</th>
              <th className="text-right py-2">Expected Return</th>
              <th className="text-right py-2">Standard Deviation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Equities (Stocks)</td>
              <td className="py-2 text-right">8.0%</td>
              <td className="py-2 text-right">18%</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Fixed Income (Bonds)</td>
              <td className="py-2 text-right">4.0%</td>
              <td className="py-2 text-right">6%</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Alternatives</td>
              <td className="py-2 text-right">6.5%</td>
              <td className="py-2 text-right">12%</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Cash / Money Market</td>
              <td className="py-2 text-right">2.5%</td>
              <td className="py-2 text-right">1%</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-2">
          * Returns are nominal (before inflation) and based on long-term historical averages
        </p>
      </section>
      
      <section className="mb-6 page-break-avoid">
        <h3 className="text-xl font-semibold mb-3">Tax Treatment</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Traditional IRA/401(k) Withdrawals:</span>
            <span className="font-medium">Ordinary Income Tax</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Roth IRA Withdrawals:</span>
            <span className="font-medium">Tax-Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Brokerage Long-Term Capital Gains:</span>
            <span className="font-medium">Preferential Rates (0%, 15%, 20%)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Social Security Benefits:</span>
            <span className="font-medium">Up to 85% Taxable</span>
          </div>
        </div>
      </section>
      
      <section className="mb-6 page-break-avoid">
        <h3 className="text-xl font-semibold mb-3">Healthcare Costs</h3>
        <div className="space-y-2 text-sm">
          <p>
            Healthcare costs are projected to increase at <strong>1.5x general inflation</strong> due to 
            medical cost inflation historically outpacing CPI.
          </p>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pre-Medicare (under 65):</span>
            <span className="font-medium">$15,000 - $25,000/year per person</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Post-Medicare (65+):</span>
            <span className="font-medium">$6,000 - $12,000/year (premiums + out-of-pocket)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Long-Term Care (if needed):</span>
            <span className="font-medium">$75,000 - $150,000/year</span>
          </div>
        </div>
      </section>
      
      <section className="page-break-avoid">
        <h3 className="text-xl font-semibold mb-3">Inflation Assumptions</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">General Inflation (CPI):</span>
            <span className="font-medium">2.5% - 3.0% per year</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Healthcare Inflation:</span>
            <span className="font-medium">4.0% - 5.0% per year</span>
          </div>
          <p className="text-muted-foreground mt-2">
            Inflation projections use stochastic modeling with mean reversion to long-term averages.
          </p>
        </div>
      </section>
    </div>
  );
}
