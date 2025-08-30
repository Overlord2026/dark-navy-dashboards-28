// src/pages/dev/FixturesPanel.tsx
import React from 'react'
import { loadFixtures as loadNil, dehydrateState as deNil, hydrateState as hyNil } from '@/fixtures/fixtures'
import { loadHealthFixtures, dehydrateHealthState, hydrateHealthState } from '@/fixtures/fixtures.health'
import { loadInvestorDemoFixtures } from '@/fixtures/demo'
import { loadNilFixtures, dehydrateNilState, hydrateNilState, clearNilFixtures } from '@/fixtures/fixtures.nil'

export default function FixturesPanel() {
  const [profile, setProfile] = React.useState<'coach'|'mom'>('coach')
  const [json, setJson] = React.useState('')

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Fixtures</h1>

      <section className="space-x-2">
        <h2 className="font-semibold">NIL</h2>
        <select value={profile} onChange={e=>setProfile(e.target.value as any)} className="border rounded px-2 py-1">
          <option value="coach">Coach</option>
          <option value="mom">Mom</option>
        </select>
        <button className="border rounded px-3 py-1" onClick={()=>loadNil({profile})}>Load NIL</button>
        <button className="border rounded px-3 py-1" onClick={()=>setJson(deNil())}>Save NIL JSON</button>
        <button className="border rounded px-3 py-1" onClick={()=>hyNil(JSON.parse(json))}>Restore NIL JSON</button>
      </section>

      <section className="space-x-2">
        <h2 className="font-semibold">Health</h2>
        <button className="border rounded px-3 py-1" onClick={()=>loadHealthFixtures()}>Load Health</button>
        <button className="border rounded px-3 py-1" onClick={()=>setJson(dehydrateHealthState())}>Save Health JSON</button>
        <button className="border rounded px-3 py-1" onClick={()=>hydrateHealthState(JSON.parse(json))}>Restore Health JSON</button>
      </section>

      <section className="space-x-2">
        <h2 className="font-semibold">NIL</h2>
        <button className="border rounded px-3 py-1" onClick={()=>loadNilFixtures('coach')}>Load Coach</button>
        <button className="border rounded px-3 py-1" onClick={()=>loadNilFixtures('mom')}>Load Mom/Guardian</button>
        <button className="border rounded px-3 py-1" onClick={()=>setJson(dehydrateNilState())}>Save NIL JSON</button>
        <button className="border rounded px-3 py-1" onClick={()=>hydrateNilState(json)}>Restore NIL JSON</button>
        <button className="border rounded px-3 py-1" onClick={()=>clearNilFixtures()}>Clear NIL</button>
      </section>

      <section className="space-x-2">
        <h2 className="font-semibold">Investor Demo</h2>
        <button className="border rounded px-3 py-1" onClick={()=>loadInvestorDemoFixtures()}>Load Demo Data</button>
      </section>

      <textarea className="w-full h-48 border rounded p-2" value={json} onChange={e=>setJson(e.target.value)} placeholder="JSON snapshot…" />
    </div>
  )
}