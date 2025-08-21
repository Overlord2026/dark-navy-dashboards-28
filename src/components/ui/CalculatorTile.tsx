import * as React from 'react'
import { Button } from './button'

interface CalculatorTileProps {
  label: string
  entitlement?: 'basic' | 'premium' | 'elite'
  description?: string
  onRun?: () => void
  onDetails?: () => void
}

export function CalculatorTile({
  label, 
  entitlement = 'basic', 
  description = 'One-line description for quick context.',
  onRun, 
  onDetails
}: CalculatorTileProps) {
  const badge = entitlement === 'elite' ? 'bg-gold-base text-ink'
              : entitlement === 'premium' ? 'bg-mint text-ink'
              : 'bg-sky text-ink'
  
  return (
    <div className="rounded-2xl border border-slate/30 bg-white shadow-soft p-4">
      <div className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${badge}`}>
        {entitlement.toUpperCase()}
      </div>
      <h4 className="mt-2 font-semibold text-[15px] text-ink">{label}</h4>
      <p className="text-slate/80 text-sm">{description}</p>
      <div className="mt-3 flex gap-2">
        <Button 
          variant="gold" 
          size="sm"
          onClick={onRun}
          className="text-xs"
        >
          <span>Run</span>
        </Button>
        <button 
          onClick={onDetails}
          className="px-3 py-2 rounded-2xl border border-slate/30 text-ink hover:bg-sand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2"
        >
          Details
        </button>
      </div>
    </div>
  )
}