import { useEffect } from "react";

type Value = "aspiring" | "retiree" | "family";
type Props = { value: Value; onChange: (v: Value) => void };

const options: Array<{key: Value; label: string}> = [
  { key: "aspiring", label: "Aspiring Families" },
  { key: "retiree",  label: "Retirees" },
  { key: "family",   label: "General" },
];

export default function PersonaSwitcher({ value, onChange }: Props) {
  // persist on change
  useEffect(() => {
    try { localStorage.setItem("__GOALS_PERSONA__", value); } catch {}
  }, [value]);

  return (
    <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={[
            "px-3 py-1.5 text-sm rounded-md transition-colors",
            value === o.key 
              ? "bg-primary text-primary-foreground font-medium" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          ].join(" ")}
          type="button"
          aria-label={`Switch to ${o.label}`}
          aria-pressed={value === o.key}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
