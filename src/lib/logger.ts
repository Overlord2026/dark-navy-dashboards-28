// S7 - Console logging redaction
// Tiny logger that redacts sensitive tokens and keys
const SENSITIVE = /(Bearer\s+[A-Za-z0-9._-]+|sk-[A-Za-z0-9]{20,}|eyJ[A-Za-z0-9._-]+)/g;

const redactSensitive = (arg: any): string => {
  return String(arg).replace(SENSITIVE, '[REDACTED]');
};

export const log = {
  info: (...args: any[]) => console.info(...args.map(redactSensitive)),
  warn: (...args: any[]) => console.warn(...args.map(redactSensitive)),
  error: (...args: any[]) => console.error(...args.map(redactSensitive))
};