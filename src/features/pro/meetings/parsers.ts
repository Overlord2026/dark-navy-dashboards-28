interface ParsedMeeting {
  title: string;
  summary: string;
  bullets: string[];
  action_items: string[];
  risks: string[];
  participants?: string[];
  meeting_date?: string;
}

export function parseZocks(zocksData: string): ParsedMeeting {
  try {
    // Zocks format parsing - structured JSON
    const data = JSON.parse(zocksData);
    
    return {
      title: data.meeting_title || data.title || 'Zocks Import',
      summary: data.summary || data.transcript || '',
      bullets: data.key_points || data.bullets || [],
      action_items: data.action_items || data.tasks || [],
      risks: data.risks || data.concerns || [],
      participants: data.participants || data.attendees || [],
      meeting_date: data.date || data.meeting_date,
    };
  } catch (error) {
    // Fallback: treat as plain text
    return parsePlain(zocksData, 'Zocks Import');
  }
}

export function parseJump(jumpData: string): ParsedMeeting {
  try {
    // Jump format parsing - structured data
    const data = JSON.parse(jumpData);
    
    return {
      title: data.session_name || data.title || 'Jump Import',
      summary: data.summary || data.content || '',
      bullets: data.highlights || data.key_points || [],
      action_items: data.next_steps || data.actions || [],
      risks: data.flags || data.risks || [],
      participants: data.participants || [],
      meeting_date: data.timestamp || data.date,
    };
  } catch (error) {
    // Fallback: treat as plain text
    return parsePlain(jumpData, 'Jump Import');
  }
}

export function parsePlain(plainText: string, title = 'Text Import'): ParsedMeeting {
  const lines = plainText.split('\n').filter(line => line.trim());
  
  // Simple parsing logic for plain text
  const summary = lines.slice(0, 3).join(' ').substring(0, 500);
  
  // Extract action items (lines starting with common prefixes)
  const actionPrefixes = ['action:', 'todo:', 'task:', '- [ ]', '* [ ]', 'follow up:', 'next:'];
  const action_items = lines.filter(line => 
    actionPrefixes.some(prefix => 
      line.toLowerCase().trim().startsWith(prefix)
    )
  ).map(line => line.replace(/^(action:|todo:|task:|- \[ \]|\* \[ \]|follow up:|next:)/i, '').trim());

  // Extract risks (lines with risk indicators)
  const riskKeywords = ['risk', 'concern', 'issue', 'problem', 'warning', 'caution'];
  const risks = lines.filter(line => 
    riskKeywords.some(keyword => 
      line.toLowerCase().includes(keyword)
    )
  ).slice(0, 5); // Limit to 5 risks

  // Convert remaining lines to bullets
  const bullets = lines
    .filter(line => !action_items.some(action => line.includes(action)))
    .filter(line => !risks.some(risk => line.includes(risk)))
    .slice(0, 10) // Limit bullets
    .map(line => line.replace(/^[-*•]\s*/, '').trim());

  return {
    title,
    summary,
    bullets,
    action_items,
    risks,
  };
}

export function generateInputsHash(meeting: ParsedMeeting): string {
  const hashData = {
    title: meeting.title,
    summary: meeting.summary,
    bullets: meeting.bullets,
    action_items: meeting.action_items,
    risks: meeting.risks,
    timestamp: Date.now()
  };
  
  return btoa(JSON.stringify(hashData)).slice(0, 32);
}