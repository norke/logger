/**
 * @module logger
 */

/**
 * @typedef {'debug' | 'log' | 'info' | 'warn' | 'error' | 'success'} LogLevel
 */

/**
 * @typedef {Object} LoggerStyleMap
 * @property {string} [debug]
 * @property {string} [log]
 * @property {string} [info]
 * @property {string} [warn]
 * @property {string} [error]
 * @property {string} [success]
 */

/**
 * @typedef {Object} LoggerOptions
 * @property {boolean} [showTimestamp=false] - Whether to prepend timestamps to messages.
 * @property {string} [namespace] - Optional namespace to prefix logs.
 * @property {LoggerStyleMap} [styles] - Custom styles for each log level.
 * @property {LogLevel} [level='debug'] - Minimum log level to display.
 */

/**
 * Log level severity ranking.
 * Lower number = more verbose.
 * @type {Record<LogLevel, number>}
 */
const LOG_LEVELS = Object.freeze({
    debug: 0,
    log: 1,
    info: 2,
    warn: 3,
    error: 4,
    success: 5,
  });
  
  /**
   * Dracula theme default styles.
   * @type {Required<LoggerStyleMap>}
   */
  const DEFAULT_STYLES = Object.freeze({
    debug: 'color: #6272a4;',                    // Comment color
    log: 'color: #f8f8f2;',                      // Foreground
    info: 'color: #8be9fd; font-weight: bold;',  // Cyan
    warn: 'color: #f1fa8c; font-weight: bold;',  // Yellow
    error: 'color: #ff5555; font-weight: bold;', // Red
    success: 'color: #50fa7b; font-weight: bold;'// Green
  });
  
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  
  /**
   * Returns a formatted timestamp string.
   * @returns {string}
   */
  function getTimestamp() {
    return `[${timeFormatter.format(new Date())}]`;
  }
  
  /**
   * Prints a styled console message.
   * @param {LogLevel} level
   * @param {string} style
   * @param {boolean} showTimestamp
   * @param {string | undefined} namespace
   * @param {any[]} args
   */
  function printStyledLog(level, style, showTimestamp, namespace, args) {
    const parts = [];
    if (showTimestamp) parts.push(getTimestamp());
    if (namespace) parts.push(`[${namespace}]`);
    parts.push(`[${level.toUpperCase()}]`);
    const prefix = `%c${parts.join(' ')}`;
    console.log(prefix, style, ...args);
  }
  
  /**
   * Creates a logger instance with styled output, level filtering, and optional hooks.
   * @param {LoggerOptions} [options={}]
   * @returns {{
   *   [K in LogLevel]: (...args: any[]) => void;
   * } & {
   *   group(title: string, callback: () => void | Promise<void>): Promise<void> | void;
   *   setEnabled(value: boolean): void;
   *   onLog(callback: (level: LogLevel, meta: { timestamp: Date, namespace?: string, level: LogLevel, args: any[] }) => void): () => void;
   * }}
   */
  export function createLogger(options = {}) {
    const {
      showTimestamp = false,
      namespace,
      styles = {},
      level = 'debug',
    } = options;
  
    let isEnabled = true;
    const mergedStyles = { ...DEFAULT_STYLES, ...styles };
    const minLevel = LOG_LEVELS[level] ?? 0;
    const hooks = new Set();
  
    /**
     * Emits a log message.
     * @param {LogLevel} level
     * @param {any[]} args
     */
    function emit(level, args) {
      if (!isEnabled || LOG_LEVELS[level] < minLevel) return;
      printStyledLog(level, mergedStyles[level], showTimestamp, namespace, args);
  
      for (const hook of hooks) {
        try {
          hook(level, {
            timestamp: new Date(),
            namespace,
            level,
            args,
          });
        } catch (e) {
          console.warn('[Logger] Hook error:', e);
        }
      }
    }
  
    /**
     * Logs a collapsible group of messages.
     * Always executes the callback for control flow reliability.
     * @param {string} title
     * @param {() => void | Promise<void>} callback
     */
    function group(title, callback) {
      const shouldRender = isEnabled && LOG_LEVELS['log'] >= minLevel;
  
      const parts = [];
      if (showTimestamp) parts.push(getTimestamp());
      if (namespace) parts.push(`[${namespace}]`);
      parts.push(`[GROUP] ${title}`);
  
      if (shouldRender) {
        console.groupCollapsed(`%c${parts.join(' ')}`, 'font-weight: bold; color: #888;');
      }
  
      try {
        const result = callback();
        if (result instanceof Promise) {
          return result.finally(() => {
            if (shouldRender) console.groupEnd();
          });
        }
        if (shouldRender) console.groupEnd();
        return result;
      } catch (err) {
        if (shouldRender) console.groupEnd();
        throw err;
      }
    }
  
    return {
      debug: (...args) => emit('debug', args),
      log: (...args) => emit('log', args),
      info: (...args) => emit('info', args),
      warn: (...args) => emit('warn', args),
      error: (...args) => emit('error', args),
      success: (...args) => emit('success', args),
      group,
      setEnabled(value) {
        isEnabled = Boolean(value);
      },
      onLog(callback) {
        hooks.add(callback);
        return () => hooks.delete(callback);
      }
    };
  }
  