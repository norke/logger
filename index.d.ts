/**
 * Type definitions for @yourname/logger
 */

/**
 * Supported log levels.
 */
export type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error' | 'success';

/**
 * CSS styles per log level.
 */
export interface LoggerStyleMap {
  debug?: string;
  log?: string;
  info?: string;
  warn?: string;
  error?: string;
  success?: string;
}

/**
 * Logger configuration options.
 */
export interface LoggerOptions {
  /**
   * Optional namespace prefix.
   */
  namespace?: string;

  /**
   * Prepend timestamps.
   */
  showTimestamp?: boolean;

  /**
   * Custom styles per log level.
   */
  styles?: LoggerStyleMap;

  /**
   * Minimum log level to output.
   */
  level?: LogLevel;
}

/**
 * Log metadata passed to hooks.
 */
export interface LogMeta {
  timestamp: Date;
  namespace?: string;
  level: LogLevel;
  args: any[];
}

/**
 * A logger instance.
 */
export interface Logger {
  debug(...args: any[]): void;
  log(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  success(...args: any[]): void;

  /**
   * Runs logs inside a collapsible console.groupCollapsed.
   * Automatically closes the group.
   */
  group(title: string, callback: () => void | Promise<void>): Promise<void> | void;

  /**
   * Enable or disable output.
   */
  setEnabled(value: boolean): void;

  /**
   * Register a hook to run on each log.
   * Returns an unsubscribe function.
   */
  onLog(callback: (level: LogLevel, meta: LogMeta) => void): () => void;
}

/**
 * Creates a new logger instance.
 */
export function createLogger(options?: LoggerOptions): Logger;
