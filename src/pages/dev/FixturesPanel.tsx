// src/pages/dev/FixturesPanel.tsx
import React from 'react'
import { loadFixtures as loadCore, dehydrateState as deCore, hydrateState as hyCore } from '@/fixtures/fixtures'
import { loadHealthFixtures, dehydrateHealthState, hydrateHealthState } from '@/fixtures/fixtures.health'
import { loadInvestorDemoFixtures } from '@/fixtures/demo'
// NIL fixtures removed

export default function FixturesPanel() {
  const [profile, setProfile] = React.useState<'coach'|'mom'>('coach')
  const [json, setJson] = React.useState('')

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Fixtures</h1>

      <section className="space-x-2">
        <h2 className="font-semibold">Core</h2>
        <button className="border rounded px-3 py-1" onClick={()=>loadCore({profile})}>Load Core</button>
        <button className="border rounded px-3 py-1" onClick={()=>setJson(deCore())}>Save Core JSON</button>
        <button className="border rounded px-3 py-1" onClick={()=>hyCore(JSON.parse(json))}>Restore Core JSON</button>
      </section>

      <section className="space-x-2">
        <h2 className="font-semibold">Health</h2>
        <button className="border rounded px-3 py-1" onClick={()=>loadHealthFixtures()}>Load Health</button>
        <button className="border rounded px-3 py-1" onClick={()=>setJson(dehydrateHealthState())}>Save Health JSON</button>
        <button className="border rounded px-3 py-1" onClick={()=>hydrateHealthState(JSON.parse(json))}>Restore Health JSON</button>
      </section>

      <section className="space-x-2">
        <h2 className="font-semibold">Investor Demo</h2>
        <button className="border rounded px-3 py-1" onClick={()=>loadInvestorDemoFixtures()}>Load Demo Data</button>
      </section>

      <textarea className="w-full h-48 border rounded p-2" value={json} onChange={e=>setJson(e.target.value)} placeholder="JSON snapshot…" />
    </div>
  )
}