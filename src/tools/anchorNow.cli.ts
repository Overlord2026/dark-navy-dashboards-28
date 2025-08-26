import { anchorNow } from "@/features/anchor/anchorNow";

(async () => {
  const env = (process.env.ENV as any) || "dev";
  const types = process.env.TYPES ? process.env.TYPES.split(",") : undefined;
  const res = await anchorNow({ env, include_types: types });
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.ok ? 0 : 1);
})();