import { assert, assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { computeMerkleRoot, sha256Hex } from "./index.ts";

deno.test("sha256Hex produces expected hash", async () => {
  const h = await sha256Hex("hello");
  assertEquals(h, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
});

deno.test("computeMerkleRoot combines leaves deterministically", async () => {
  const leaves = ["a", "b", "c"]; // simple strings
  const root1 = await computeMerkleRoot(leaves);
  const root2 = await computeMerkleRoot(leaves);
  assert(root1.length === 64);
  assertEquals(root1, root2);
});
