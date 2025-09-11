import React, { useMemo, useState } from "react";
import * as Canonical from "@/lib/canonical";

export default function CanonTest() {
  const [raw, setRaw] = useState<string>(
    JSON.stringify({ z: 2, a: "Á", when: "2025-09-06T12:00:00Z" }, null, 2)
  );
  const [arraySortKeys, setArraySortKeys] = useState<string>("");
  const [canon, setCanon] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  const arrKeys = useMemo(
    () =>
      arraySortKeys
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [arraySortKeys]
  );

  async function run() {
    try {
      setError("");
      const parsed = JSON.parse(raw);
      const c = Canonical.canonicalize(parsed, arrKeys);
      setCanon(c);
      const h = await Canonical.inputsHash(parsed, arrKeys);
      setHash(h);
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setCanon("");
      setHash("");
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Canonicalization & Hash Playground</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input JSON</label>
          <textarea
            className="w-full h-64 border rounded p-2 font-mono text-sm"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
          <label className="block text-sm font-medium">
            Array sort keys (optional, JSON-Pointer paths joined by commas)
          </label>
          <input
            className="w-full border rounded p-2 text-sm"
            placeholder="/items,/rules/0/scopes"
            value={arraySortKeys}
            onChange={(e) => setArraySortKeys(e.target.value)}
          />
          <button
            className="mt-2 px-3 py-2 border rounded bg-black text-white"
            onClick={run}
          >
            Canonicalize & Hash
          </button>
          {error && <div className="text-red-600 text-sm mt-2">Error: {error}</div>}
        </div>

        <div className="space-y-3">
          <div className="border rounded p-2">
            <div className="font-medium mb-1 text-sm">Canonical JSON</div>
            <pre className="text-xs whitespace-pre-wrap">{canon || "—"}</pre>
          </div>
          <div className="border rounded p-2">
            <div className="font-medium mb-1 text-sm">SHA-256 (hex)</div>
            <code className="text-xs break-all">{hash || "—"}</code>
          </div>
        </div>
      </div>
    </div>
  );
}