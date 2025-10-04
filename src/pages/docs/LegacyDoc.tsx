import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/nav/Breadcrumbs";

// If you have an SEO Head component, uncomment and use it:
// import Head from "@/components/seo/Head";

export default function LegacyDoc() {
  const title = "SWAG™ Legacy Planning — Docs";
  const description =
    "Organize heirs, assets, and instructions—kept current with reminders and audit-ready exports. Not a substitute for legal advice.";

  // Minimal meta fallback if you don't have a shared <Head /> component
  useEffect(() => {
    document.title = title;
    const metaName = "description";
    let tag = document.querySelector(`meta[name='${metaName}']`) as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", metaName);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description);
  }, []);

  return (
    <>
      {/* If you have a shared Head component, prefer this instead:
      <Head title={title} description={description} path="/docs/legacy" />
      */}

      <main className="mx-auto max-w-3xl px-4 py-12 text-gray-900 dark:text-bfo-ivory">
        <div className="mb-4">
          <Breadcrumbs />
        </div>

        <header className="mb-8">
          <p className="inline-block rounded-md border px-2 py-0.5 text-xs opacity-80">
            Beta
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">SWAG™ Legacy Planning</h1>
          <p className="mt-2 text-gray-600 dark:text-white/70">{description}</p>
        </header>

        <section className="prose prose-slate dark:prose-invert">
          <h2>What it is (and isn't)</h2>
          <ul>
            <li>
              <strong>Is:</strong> A structured workflow to collect people, assets, documents, and wishes; share them with the right roles; and keep them current with reminders and change-tracking.
            </li>
            <li>
              <strong>Isn't:</strong> A will/trust generator or legal opinion. Use this alongside your attorney.
            </li>
          </ul>

          <h2>Quickstart (10–15 minutes)</h2>
          <ol>
            <li>Create/choose a household.</li>
            <li>Add <em>Heirs & Roles</em> (executor, trustee, POA, guardians).</li>
            <li>Attach the "5 critical docs" you already have (will, trust, POAs, HIPAA, deeds).</li>
            <li>List key accounts & digital assets (where, who can access).</li>
            <li>Share "viewer" access with your executor; add an attestation note.</li>
            <li>Export the <em>Executor Bundle</em> and save the receipt.</li>
          </ol>

          <h2>Core concepts</h2>
          <ul>
            <li><strong>Roles & Permissions:</strong> Viewer vs. Contributor vs. Admin; share grants are logged with receipts.</li>
            <li><strong>Checklists:</strong> Progress bar + required items for an executor-ready state.</li>
            <li><strong>Receipts & Exports:</strong> Each export is recorded with a hash so you can prove "what was shared, when."</li>
            <li><strong>Renewals:</strong> We nudge to re-validate stale data and show "what changed since last export."</li>
          </ul>

          <h2>Availability during Beta</h2>
          <ul>
            <li><strong>Families:</strong> Legacy basics included.</li>
            <li><strong>Advisor Premium &amp; RIA (20+ seats):</strong> Full Legacy included during beta.</li>
            <li><strong>Advanced Legacy Vault (Families):</strong> Coming soon.</li>
          </ul>

          <h2>Privacy & compliance</h2>
          <p>
            You control sharing. We provide encrypted storage, role-based access, and audit receipts on supported plans. Always store originals per your attorney's guidance.
          </p>

          <h2>Next steps</h2>
          <ul>
            <li>
              Families: <Link className="underline" to="/pricing#families">choose a plan</Link> and start the Legacy checklist.
            </li>
            <li>
              Advisors/RIA: <Link className="underline" to="/contact?plan=ria">contact sales</Link> to enable firm-wide beta.
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}