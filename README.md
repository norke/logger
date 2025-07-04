
# @yourname/logger

A simple, stylish, zero-dependency logger for the browser console, themed with the Dracula color palette.
Supports log levels, timestamps, namespaces, groups, custom styles, and log hooks.

---

## Installation

\`\`\`bash
npm install @yourname/logger
\`\`\`

---

## Quick Example

\`\`\`js
import { createLogger } from '@yourname/logger';

const logger = createLogger({
  namespace: 'MyApp',
  showTimestamp: true
});

logger.debug('Debugging...');
logger.log('Plain log.');
logger.info('Some info.');
logger.warn('Careful...');
logger.error('Oops!');
logger.success('It worked!');

logger.group('Grouped logs', () => {
  logger.log('Inside the group');
  logger.info('Another message');
});
\`\`\`

---

## Options

\`createLogger(options)\` accepts an optional config object:

| Option            | Type               | Default        | Description                                            |
| ----------------- | ------------------ | -------------- | ------------------------------------------------------ |
| \`namespace\`     | \`string\`         | \`undefined\`  | A prefix shown before each log line.                   |
| \`showTimestamp\` | \`boolean\`        | \`false\`      | If\`true\`, prepends the current time to each log.     |
| \`styles\`        | \`LoggerStyleMap\` | Dracula colors | Override the default per-level console styles.         |
| \`level\`         | \`LogLevel\`       | \`'debug'\`    | Minimum log level to output. Lower levels are skipped. |

---

## Supported Log Levels

| Level       | Description                  |
| ----------- | ---------------------------- |
| \`debug\`   | Detailed debug output.       |
| \`log\`     | General log output.          |
| \`info\`    | Informational message.       |
| \`warn\`    | Warning, needs attention.    |
| \`error\`   | Error or failure.            |
| \`success\` | Success or positive outcome. |

Logs below the configured \`level\` are filtered out.

---

## Default Styles (Dracula Theme)

\`\`\`js
{
  debug: 'color: #6272a4;',
  log: 'color: #f8f8f2;',
  info: 'color: #8be9fd; font-weight: bold;',
  warn: 'color: #f1fa8c; font-weight: bold;',
  error: 'color: #ff5555; font-weight: bold;',
  success: 'color: #50fa7b; font-weight: bold;'
}
\`\`\`

Override any levels style:
\`\`\`js
const logger = createLogger({
  styles: {
    error: 'color: red; font-weight: bold;',
    success: 'color: green;'
  }
});
\`\`\`

---

## API Reference

### \`createLogger(options)\`

Creates a logger instance.

Returns an object with:

| Method                     | Description                                                                       |
| -------------------------- | --------------------------------------------------------------------------------- |
| \`debug(...args)\`         | Logs a debug message.                                                             |
| \`log(...args)\`           | Logs a plain message.                                                             |
| \`info(...args)\`          | Logs an info message.                                                             |
| \`warn(...args)\`          | Logs a warning.                                                                   |
| \`error(...args)\`         | Logs an error.                                                                    |
| \`success(...args)\`       | Logs a success message.                                                           |
| \`group(title, callback)\` | Runs logs inside a\`console.groupCollapsed\`. Ends automatically. Supports async. |
| \`setEnabled(value)\`      | Enables or disables all logging dynamically.                                      |
| \`onLog(callback)\`        | Registers a custom hook triggered on every log. Returns an unsubscribe function.  |

---

## \`group\`

Run related logs inside a collapsible group.

\`\`\`js
logger.group('Loading Data', () => {
  logger.debug('Step 1...');
  logger.debug('Step 2...');
});
\`\`\`

Async supported:

\`\`\`js
await logger.group('Async Task', async () => {
  await doSomething();
  logger.success('Done!');
});
\`\`\`

---

## \`setEnabled\`

Enable/disable output on the fly.

\`\`\`js
logger.setEnabled(false); // Silence logs
logger.setEnabled(true);  // Resume logs
\`\`\`

---

## \`onLog\`

Register a hook for custom log handling (e.g. send logs to a server).

\`\`\`js
const unsubscribe = logger.onLog((level, meta) => {
  console.log('HOOK:', meta);
  // meta = { timestamp, namespace, level, args }
});

unsubscribe(); // Remove the hook
\`\`\`

---

## Type Definitions

The library is fully documented with JSDoc:

\`\`\`ts
type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error' | 'success';

type LoggerStyleMap = {
  debug?: string;
  log?: string;
  info?: string;
  warn?: string;
  error?: string;
  success?: string;
};

type LoggerOptions = {
  namespace?: string;
  showTimestamp?: boolean;
  styles?: LoggerStyleMap;
  level?: LogLevel;
};
\`\`\`

---

## Example: Custom Styles & Hooks

\`\`\`js
const logger = createLogger({
  namespace: 'MyApp',
  showTimestamp: true,
  styles: {
    info: 'color: #00f; font-weight: bold;'
  },
  level: 'info'
});

// Only info, warn, error, success will be shown
logger.debug('Will not be shown');
logger.info('Will be shown');

// Add a hook
const unsub = logger.onLog((level, meta) => {
  sendToServer(meta);
});
\`\`\`

---

## Summary of Features

 No dependencies
 Fully tree-shakable ESM
 Dracula theme by default
 Log levels with filtering
 Optional timestamps and namespaces
 Console \`groupCollapsed\` helper
 Custom hooks for advanced handling

---

## License

MIT  [Your Name](https://github.com/yourname)

---

## Author

[Your Name](https://github.com/yourname)
