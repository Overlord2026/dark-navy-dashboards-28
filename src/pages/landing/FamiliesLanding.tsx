import { Link } from 'react-router-dom'

export default function FamiliesLanding() {
  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl md:text-5xl font-serif mb-6">Families</h1>
      <p className="mb-8 max-w-2xl text-lg opacity-80">
        Pick your path and jump into a guided workspace. Everything is privacy-first with
        receipts you can prove.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Retirees" to="/start/families?segment=retirees" />
        <Card title="Aspiring Families" to="/start/families?segment=aspiring" />
      </div>
    </div>
  )
}

function Card({ title, to }: { title: string; to: string }) {
  return (
    <Link to={to} className="block rounded-2xl border border-bfo-gold p-6 hover:bg-white/5">
      <h2 className="text-xl mb-2">{title}</h2>
      <span className="text-bfo-gold">Open workspace →</span>
    </Link>
  )
}