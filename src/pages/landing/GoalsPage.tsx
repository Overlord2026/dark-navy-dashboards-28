export default function GoalsPage() {
  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl md:text-5xl font-serif mb-6">Goals</h1>
      <p className="mb-8 max-w-2xl text-lg opacity-80">
        Set your financial goals and get personalized recommendations with privacy-first tracking.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-bfo-gold p-6">
          <h2 className="text-xl mb-4">Retirement Planning</h2>
          <p className="text-sm opacity-70 mb-4">Calculate retirement needs and optimize savings strategies</p>
          <button className="text-bfo-gold hover:underline">Launch Tool →</button>
        </div>
        
        <div className="rounded-2xl border border-bfo-gold p-6">
          <h2 className="text-xl mb-4">Tax Optimization</h2>
          <p className="text-sm opacity-70 mb-4">Minimize tax liability with strategic planning</p>
          <button className="text-bfo-gold hover:underline">Launch Tool →</button>
        </div>
        
        <div className="rounded-2xl border border-bfo-gold p-6">
          <h2 className="text-xl mb-4">Estate Planning</h2>
          <p className="text-sm opacity-70 mb-4">Protect and transfer wealth efficiently</p>
          <button className="text-bfo-gold hover:underline">Launch Tool →</button>
        </div>
      </div>
    </div>
  );
}