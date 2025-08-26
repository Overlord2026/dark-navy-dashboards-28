import React from 'react';
import { 
  getCMA, 
  setCMA, 
  getGlide, 
  setGlide, 
  parseCMAFromCSV, 
  parseGlideFromCSV,
  exportCMAToCSV,
  exportGlideToCSV 
} from '@/features/k401/cma/store';
import type { CMARow, GlideRow } from '@/features/k401/cma/types';

export default function K401CMAUploader() {
  const [cmaData, setCMAData] = React.useState<CMARow[]>(getCMA());
  const [glideData, setGlideData] = React.useState<GlideRow[]>(getGlide());
  const [uploadStatus, setUploadStatus] = React.useState<string>('');

  const handleCMAUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsed = parseCMAFromCSV(csvText);
        setCMA(parsed);
        setCMAData(parsed);
        setUploadStatus(`✅ CMA updated: ${parsed.length} assets loaded`);
      } catch (error) {
        setUploadStatus(`❌ CMA upload failed: ${error}`);
      }
    };
    reader.readAsText(file);
  };

  const handleGlideUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsed = parseGlideFromCSV(csvText);
        setGlide(parsed);
        setGlideData(parsed);
        setUploadStatus(`✅ Glide Path updated: ${parsed.length} age points loaded`);
      } catch (error) {
        setUploadStatus(`❌ Glide Path upload failed: ${error}`);
      }
    };
    reader.readAsText(file);
  };

  const downloadCMA = () => {
    const csv = exportCMAToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cma.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadGlide = () => {
    const csv = exportGlideToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glidepath.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Capital Market Assumptions & Glide Path</h1>
      
      {uploadStatus && (
        <div className="p-3 rounded-xl border bg-muted text-sm">
          {uploadStatus}
        </div>
      )}

      {/* CMA Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-medium">Capital Market Assumptions</h2>
        
        <div className="flex gap-2 items-center">
          <label className="rounded-xl border px-3 py-2 bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
            Upload CMA CSV
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleCMAUpload}
              className="hidden" 
            />
          </label>
          <button 
            onClick={downloadCMA}
            className="rounded-xl border px-3 py-2"
          >
            Download Current CMA
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          Expected format: headers `asset,er,stdev` (e.g., US_Equity,0.065,0.16)
        </div>

        <div className="rounded-xl border overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2">Asset</th>
                <th className="text-left p-2">Expected Return</th>
                <th className="text-left p-2">Std Dev</th>
              </tr>
            </thead>
            <tbody>
              {cmaData.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 font-medium">{row.asset}</td>
                  <td className="p-2">{(row.er * 100).toFixed(1)}%</td>
                  <td className="p-2">{(row.stdev * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Glide Path Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-medium">Target Date Glide Path</h2>
        
        <div className="flex gap-2 items-center">
          <label className="rounded-xl border px-3 py-2 bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
            Upload Glide Path CSV
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleGlideUpload}
              className="hidden" 
            />
          </label>
          <button 
            onClick={downloadGlide}
            className="rounded-xl border px-3 py-2"
          >
            Download Current Glide Path
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          Expected format: headers `age,equity,bonds,cash` (e.g., 25,0.90,0.09,0.01)
        </div>

        <div className="rounded-xl border overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2">Age</th>
                <th className="text-left p-2">Equity %</th>
                <th className="text-left p-2">Bonds %</th>
                <th className="text-left p-2">Cash %</th>
                <th className="text-left p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {glideData.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 font-medium">{row.age}</td>
                  <td className="p-2">{(row.equity * 100).toFixed(0)}%</td>
                  <td className="p-2">{(row.bonds * 100).toFixed(0)}%</td>
                  <td className="p-2">{(row.cash * 100).toFixed(0)}%</td>
                  <td className="p-2 text-xs">
                    {((row.equity + row.bonds + row.cash) * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        These assumptions are used by the Monte Carlo retirement simulator. 
        Data is stored in memory and will reset on page refresh.
      </div>
    </div>
  );
}