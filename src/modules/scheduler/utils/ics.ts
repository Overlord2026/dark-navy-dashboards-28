/**
 * ICS (iCalendar) file generation utilities
 * Generates .ics files for calendar events
 */

export interface ICSEvent {
  uid: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  organizer?: {
    name: string;
    email: string;
  };
  attendee?: {
    name: string;
    email: string;
  };
}

const formatDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

const escapeText = (text: string): string => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
};

export const buildICS = (event: ICSEvent): string => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Family Office Marketplace//NIL Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.uid}@familyofficemarketplace.com`,
    `DTSTART:${formatDate(event.startTime)}`,
    `DTEND:${formatDate(event.endTime)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `CREATED:${formatDate(new Date())}`,
    `LAST-MODIFIED:${formatDate(new Date())}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'TRANSP:OPAQUE'
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeText(event.location)}`);
  }

  if (event.organizer) {
    lines.push(`ORGANIZER;CN=${escapeText(event.organizer.name)}:mailto:${event.organizer.email}`);
  }

  if (event.attendee) {
    lines.push(
      `ATTENDEE;CN=${escapeText(event.attendee.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${event.attendee.email}`
    );
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  
  return lines.join('\r\n');
};

export const downloadICS = (icsContent: string, filename: string) => {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};