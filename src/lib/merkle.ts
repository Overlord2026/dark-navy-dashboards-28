// src/lib/merkle.ts (browser-safe; async)
import * as Canonical from '@/lib/canonical';

export async function buildMerkle(leavesHex: string[]) {
  if (!leavesHex.length) return { root: await Canonical.sha256Hex(''), levels: [[await Canonical.sha256Hex('')]] };
  const levels: string[][] = [];
  levels.push([...leavesHex]);

  while (levels[levels.length - 1].length > 1) {
    const prev = levels[levels.length - 1];
    const next: string[] = [];
    for (let i = 0; i < prev.length; i += 2) {
      const left = prev[i];
      const right = prev[i + 1] ?? prev[i];
      next.push(await Canonical.sha256Hex(left + right));
    }
    levels.push(next);
  }
  return { root: levels[levels.length - 1][0], levels };
}

export function getProof(levels: string[][], index: number): string[] {
  const proof: string[] = [];
  let idx = index;
  for (let level = 0; level < levels.length - 1; level++) {
    const nodes = levels[level];
    const isRight = idx % 2 === 1;
    const sibIdx = isRight ? idx - 1 : idx + 1;
    const sib = nodes[sibIdx] ?? nodes[idx];
    proof.push((isRight ? 'L:' : 'R:') + sib);
    idx = Math.floor(idx / 2);
  }
  return proof;
}

export async function verifyProof(leaf: string, proof: string[], root: string): Promise<boolean> {
  let computed = leaf;
  for (const step of proof) {
    const side = step.slice(0, 2);
    const sib  = step.slice(2);
    computed = (side === 'L:') ? await Canonical.sha256Hex(sib + computed) : await Canonical.sha256Hex(computed + sib);
  }
  return computed === root;
}