// Issue short-lived "on-behalf-of" tokens for provider APIs.
// Replace with server broker in production; never store client credentials here.

export async function mintReadToken(sessionId: string) { 
  return { 
    token: `read-${sessionId}`, 
    exp: Date.now() + 15 * 60 * 1000 
  }; 
}

export async function mintTradeToken(sessionId: string) { 
  return { 
    token: `trade-${sessionId}`, 
    exp: Date.now() + 15 * 60 * 1000 
  }; 
}