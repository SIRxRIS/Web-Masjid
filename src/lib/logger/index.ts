// lib/logger/index.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class Logger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }
  
  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      data
    };
    
    // Di lingkungan development, log ke console
    if (process.env.NODE_ENV !== 'production') {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warn' ? console.warn : 
                           level === 'info' ? console.info : console.debug;
      
      consoleMethod(`[${entry.timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`, data || '');
    } else {
      // Di lingkungan production, bisa mengirim log ke layanan eksternal
      // Contoh: kirim ke Sentry, LogRocket, atau sistem logging lainnya
      // sendToExternalLoggingService(entry);
      
      // Tetap log error ke console di production
      if (level === 'error' || level === 'warn') {
        console[level](`[${entry.timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`, data || '');
      }
    }
    
    return entry;
  }
  
  debug(message: string, data?: any) {
    return this.log('debug', message, data);
  }
  
  info(message: string, data?: any) {
    return this.log('info', message, data);
  }
  
  warn(message: string, data?: any) {
    return this.log('warn', message, data);
  }
  
  error(message: string, data?: any) {
    return this.log('error', message, data);
  }
}

export function createLogger(context: string) {
  return new Logger(context);
}