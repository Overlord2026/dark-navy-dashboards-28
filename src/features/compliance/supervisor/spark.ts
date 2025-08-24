// Simple sparkline generator for trends
export function sparkline(values: number[]): string {
  if (values.length < 2) return '';
  
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;
  
  if (range === 0) return '▁'.repeat(values.length);
  
  const sparks = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  
  return values
    .map(v => {
      const normalized = (v - min) / range;
      const index = Math.floor(normalized * (sparks.length - 1));
      return sparks[index];
    })
    .join('');
}