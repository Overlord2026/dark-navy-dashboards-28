import * as Canonical from "@/lib/canonical";

export default function CanonicalExports() {
  const keys = Object.keys(Canonical).sort();
  return (
    <div style={{padding:16,fontFamily:"system-ui"}}>
      <h1>Canonical exports</h1>
      <pre>{JSON.stringify(keys, null, 2)}</pre>
    </div>
  );
}