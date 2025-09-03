export function parseToSwag(input){
  const raw = (input && typeof input === "object") ? input : {};
  const plan = { id: String(raw.id ?? "SWAG-DEMO"), name: String(raw.name ?? "Demo Plan"), ...raw };
  return { plan, raw };
}