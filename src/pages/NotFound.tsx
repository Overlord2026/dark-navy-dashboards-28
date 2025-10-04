export default function NotFound(){
  return (
    <div className="container mx-auto px-4 py-16 text-bfo-ivory">
      <h1 className="text-3xl font-semibold">We couldn't find that page.</h1>
      <p className="text-white/70 mt-2">Try one of these hubs:</p>
      <ul className="mt-3 list-disc pl-5">
        <li><a className="underline" href="/">Home</a></li>
        <li><a className="underline" href="/families">Families</a></li>
        <li><a className="underline" href="/professionals">Professionals</a></li>
        <li><a className="underline" href="/solutions">Solutions</a></li>
      </ul>
    </div>
  );
}
