import { Meeting, ProPersona } from '../types';

const STORAGE_KEY = 'pro_meetings';

export class MeetingModel {
  static getAll(): Meeting[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getByPersona(persona: ProPersona): Meeting[] {
    return this.getAll().filter(meeting => meeting.persona === persona);
  }

  static create(meetingData: Omit<Meeting, 'id' | 'created_at'>): Meeting {
    const meeting: Meeting = {
      ...meetingData,
      id: `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    const meetings = this.getAll();
    meetings.unshift(meeting);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    
    return meeting;
  }

  static update(id: string, updates: Partial<Meeting>): Meeting | null {
    const meetings = this.getAll();
    const index = meetings.findIndex(meeting => meeting.id === id);
    
    if (index === -1) return null;
    
    meetings[index] = { ...meetings[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    
    return meetings[index];
  }

  static delete(id: string): boolean {
    const meetings = this.getAll();
    const filtered = meetings.filter(meeting => meeting.id !== id);
    
    if (filtered.length === meetings.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  static exportCSV(persona?: ProPersona): string {
    const meetings = persona ? this.getByPersona(persona) : this.getAll();
    
    const headers = ['Title', 'Source', 'Date', 'Participants', 'Action Items', 'Risks', 'Created At'];
    const rows = meetings.map(meeting => [
      meeting.title,
      meeting.source,
      meeting.meeting_date || '',
      meeting.participants?.join('; ') || '',
      meeting.action_items.length.toString(),
      meeting.risks.length.toString(),
      new Date(meeting.created_at).toLocaleDateString()
    ]);

    return [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  static getMetrics(persona?: ProPersona) {
    const meetings = persona ? this.getByPersona(persona) : this.getAll();
    
    return {
      total: meetings.length,
      by_source: {
        zocks: meetings.filter(m => m.source === 'zocks').length,
        jump: meetings.filter(m => m.source === 'jump').length,
        plain: meetings.filter(m => m.source === 'plain').length,
        upload: meetings.filter(m => m.source === 'upload').length,
        recorded: meetings.filter(m => m.source === 'recorded').length,
      },
      with_risks: meetings.filter(m => m.risks.length > 0).length,
      with_anchors: meetings.filter(m => m.anchor_ref).length,
      total_action_items: meetings.reduce((sum, m) => sum + m.action_items.length, 0),
    };
  }
}