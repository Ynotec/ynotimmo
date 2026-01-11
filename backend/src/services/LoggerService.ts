import { LogLevel } from '../models/ILogger'

export class LoggerService {
  private static instance: LoggerService
  private level: LogLevel
  private context: string

  private constructor(level: LogLevel, context: string) {
    this.level = level
    this.context = context
  }

  public static getInstance(level?: LogLevel, context?: string): LoggerService {
    if (!LoggerService.instance) {
      const finalLevel = level ?? LogLevel.DEBUG
      const finalContext = context || 'Default'

      LoggerService.instance = new LoggerService(finalLevel, finalContext)
    }
    return LoggerService.instance
  }

  private getCurrentTimestamp(): string {
    return new Date().toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  private formatMessage(
    levelTag: string,
    className: string,
    methodName: string,
    message: string
  ): string {
    const timestamp = this.getCurrentTimestamp()
    const context = this.context ? `[${this.context}]` : ''
    return `${timestamp}[${levelTag}]${context} ${className}.${methodName}: ${message}`
  }

  private shouldLog(targetLevel: LogLevel): boolean {
    return targetLevel >= this.level
  }

  debug(className: string, methodName: string, message: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', className, methodName, message))
    }
  }

  info(className: string, methodName: string, message: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', className, methodName, message))
    }
  }

  warn(className: string, methodName: string, message: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', className, methodName, message))
    }
  }

  error(
    className: string,
    methodName: string,
    message: string,
    error?: unknown
  ): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(
        this.formatMessage('ERROR', className, methodName, message),
        error ?? ''
      )
    }
  }
}
