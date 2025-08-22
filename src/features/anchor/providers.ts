export async function anchorBatch(root: string) {
  return { 
    merkle_root: root, 
    cross_chain_locator: [{
      chain_id: 'perm-A', 
      tx_ref: '0xabc', 
      ts: Math.floor(Date.now() / 1000)
    }] 
  };
}

export function acceptNofM(ref: { cross_chain_locator?: any[] } | null, n = 1) {
  return (ref?.cross_chain_locator?.length || 0) >= n;
}