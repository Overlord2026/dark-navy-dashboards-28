export default function CatalogPage() {
  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl md:text-5xl font-serif mb-6">Catalog</h1>
      <p className="mb-8 max-w-2xl text-lg opacity-80">
        Discover financial solutions, tools, and services tailored to your needs.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-bfo-gold p-6">
          <h3 className="text-lg mb-2">Investment Tools</h3>
          <p className="text-sm opacity-70 mb-4">Portfolio analysis and optimization</p>
          <button className="text-bfo-gold hover:underline text-sm">Explore →</button>
        </div>
        
        <div className="rounded-2xl border border-bfo-gold p-6">
          <h3 className="text-lg mb-2">Insurance Products</h3>
          <p className="text-sm opacity-70 mb-4">Life, annuity, and protection solutions</p>
          <button className="text-bfo-gold hover:underline text-sm">Explore →</button>
        </div>
        
        <div className="rounded-2xl border border-bfo-gold p-6">
          <h3 className="text-lg mb-2">Tax Solutions</h3>
          <p className="text-sm opacity-70 mb-4">Tax planning and optimization tools</p>
          <button className="text-bfo-gold hover:underline text-sm">Explore →</button>
        </div>
        
        <div className="rounded-2xl border border-bfo-gold p-6">
          <h3 className="text-lg mb-2">Estate Planning</h3>
          <p className="text-sm opacity-70 mb-4">Wealth transfer and protection</p>
          <button className="text-bfo-gold hover:underline text-sm">Explore →</button>
        </div>
      </div>
    </div>
  );
}