import React from 'react';

interface ROIInputs {
  planParticipants: number;
  avgBalance: number;
  currentMatchRate: number;
  targetMatchRate: number;
  avgFeeRate: number;
  feeReduction: number;
  rolloverVolume: number;
  rolloverTimeSavings: number;
}

interface ROIOutputs {
  additionalMatchCapture: number;
  annualFeeSavings: number;
  rolloverEfficiency: number;
  totalAnnualValue: number;
  threeYearValue: number;
}

export default function ROICalculator() {
  const [inputs, setInputs] = React.useState<ROIInputs>({
    planParticipants: 500,
    avgBalance: 75000,
    currentMatchRate: 0.65,
    targetMatchRate: 0.85,
    avgFeeRate: 0.0125,
    feeReduction: 0.0025,
    rolloverVolume: 50,
    rolloverTimeSavings: 14
  });

  const calculateROI = (): ROIOutputs => {
    const totalPlanAssets = inputs.planParticipants * inputs.avgBalance;
    const matchIncrease = inputs.targetMatchRate - inputs.currentMatchRate;
    const additionalMatchCapture = totalPlanAssets * matchIncrease * 0.06; // Assumes 6% avg employer match
    
    const annualFeeSavings = totalPlanAssets * inputs.feeReduction;
    const rolloverEfficiency = inputs.rolloverVolume * inputs.rolloverTimeSavings * 150; // $150/day value
    const totalAnnualValue = additionalMatchCapture + annualFeeSavings + rolloverEfficiency;
    
    return {
      additionalMatchCapture,
      annualFeeSavings,
      rolloverEfficiency,
      totalAnnualValue,
      threeYearValue: totalAnnualValue * 3
    };
  };

  const outputs = calculateROI();

  const updateInput = (key: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const downloadCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Plan Participants', inputs.planParticipants.toString()],
      ['Average Balance', `$${inputs.avgBalance.toLocaleString()}`],
      ['Current Match Rate', `${(inputs.currentMatchRate * 100).toFixed(1)}%`],
      ['Target Match Rate', `${(inputs.targetMatchRate * 100).toFixed(1)}%`],
      ['Current Fee Rate', `${(inputs.avgFeeRate * 100).toFixed(2)}%`],
      ['Fee Reduction', `${(inputs.feeReduction * 100).toFixed(2)}%`],
      ['Annual Rollover Volume', inputs.rolloverVolume.toString()],
      ['Days Saved per Rollover', inputs.rolloverTimeSavings.toString()],
      ['', ''],
      ['RESULTS', ''],
      ['Additional Match Capture', `$${outputs.additionalMatchCapture.toLocaleString()}`],
      ['Annual Fee Savings', `$${outputs.annualFeeSavings.toLocaleString()}`],
      ['Rollover Efficiency Value', `$${outputs.rolloverEfficiency.toLocaleString()}`],
      ['Total Annual Value', `$${outputs.totalAnnualValue.toLocaleString()}`],
      ['3-Year Value', `$${outputs.threeYearValue.toLocaleString()}`]
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roi-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">401(k) Plan ROI Calculator</h1>
        <p className="text-muted-foreground">Calculate the value proposition for your 401(k) optimization services</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Plan Inputs</h2>
          
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium">Plan Participants</span>
              <input 
                type="number" 
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={inputs.planParticipants}
                onChange={e => updateInput('planParticipants', parseInt(e.target.value) || 0)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Average Account Balance</span>
              <input 
                type="number" 
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={inputs.avgBalance}
                onChange={e => updateInput('avgBalance', parseInt(e.target.value) || 0)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Current Match Participation Rate (%)</span>
              <input 
                type="number" 
                step="0.01"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={inputs.currentMatchRate * 100}
                onChange={e => updateInput('currentMatchRate', (parseFloat(e.target.value) || 0) / 100)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Target Match Participation Rate (%)</span>
              <input 
                type="number" 
                step="0.01"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={inputs.targetMatchRate * 100}
                onChange={e => updateInput('targetMatchRate', (parseFloat(e.target.value) || 0) / 100)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Current Average Fee Rate (%)</span>
              <input 
                type="number" 
                step="0.001"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={inputs.avgFeeRate * 100}
                onChange={e => updateInput('avgFeeRate', (parseFloat(e.target.value) || 0) / 100)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Expected Fee Reduction (%)</span>
              <input 
                type="number" 
                step="0.001"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={inputs.feeReduction * 100}
                onChange={e => updateInput('feeReduction', (parseFloat(e.target.value) || 0) / 100)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Annual Rollover Volume</span>
              <input 
                type="number" 
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={inputs.rolloverVolume}
                onChange={e => updateInput('rolloverVolume', parseInt(e.target.value) || 0)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Days Saved per Rollover</span>
              <input 
                type="number" 
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={inputs.rolloverTimeSavings}
                onChange={e => updateInput('rolloverTimeSavings', parseInt(e.target.value) || 0)}
              />
            </label>
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Value Calculation</h2>
          
          <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Additional Match Capture:</span>
              <span className="text-lg font-bold text-green-600">
                ${outputs.additionalMatchCapture.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Annual Fee Savings:</span>
              <span className="text-lg font-bold text-green-600">
                ${outputs.annualFeeSavings.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Rollover Efficiency Value:</span>
              <span className="text-lg font-bold text-green-600">
                ${outputs.rolloverEfficiency.toLocaleString()}
              </span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Annual Value:</span>
              <span className="text-2xl font-bold text-green-700">
                ${outputs.totalAnnualValue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">3-Year Value:</span>
              <span className="text-2xl font-bold text-green-800">
                ${outputs.threeYearValue.toLocaleString()}
              </span>
            </div>
          </div>

          <button 
            onClick={downloadCSV}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Download ROI Report (CSV)
          </button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Match capture assumes 6% average employer match rate</p>
            <p>• Rollover efficiency valued at $150/day saved</p>
            <p>• Calculations are estimates for demonstration purposes</p>
          </div>
        </div>
      </div>
    </div>
  );
}