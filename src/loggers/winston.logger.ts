import * as _ from 'lodash';
import { transports, format, createLogger, LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';

// custom log display format
const customFormat = format.printf(({ timestamp, level, stack, message }) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});

// file on daily rotation (error only)
const errorFileLogger = new transports.DailyRotateFile({
  // %DATE will be replaced by the current date
  filename: `logs/%DATE%-error.log`,
  level: 'error',
  format: format.combine(format.timestamp(), format.json()),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false, // don't want to zip our logs
  maxFiles: '30d', // will keep log until they are older than 30 days
});

// same for all levels
const combinedFileLogger = new transports.DailyRotateFile({
  filename: `logs/%DATE%-combined.log`,
  format: format.combine(format.timestamp(), format.json()),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: '30d',
});

// we also want to see logs in our console
const consoleLogger = new transports.Console({
  format: format.combine(
    format.cli(),
    format.splat(),
    format.timestamp(),
    // format.printf((info) => {
    //   return `${info.timestamp} ${info.level}: ${info.message}`;
    // }),
    customFormat,
  ),
});

// const options = {
//   file: {
//     filename: 'error.log',
//     level: 'error',
//   },
//   console: {
//     level: 'silly',
//   },
// };

// // for development environment
// const devLogger: LoggerOptions = {
//   format: format.combine(
//     format.timestamp(),
//     format.errors({ stack: true }),
//     customFormat,
//   ),
//   transports: [new transports.Console(options.console)],
// };

// // for production environment
// const prodLogger: LoggerOptions = {
//   format: format.combine(
//     format.timestamp(),
//     format.errors({ stack: true }),
//     format.json(),
//   ),
//   transports: [
//     new transports.File(options.file),
//     new transports.File({
//       filename: 'combine.log',
//       level: 'info',
//     }),
//   ],
// };

const loggerOption: LoggerOptions = {
  transports: [
    // file on daily rotation (error only)
    errorFileLogger,
    // same for all levels
    combinedFileLogger,
    // we also want to see logs in our console
    consoleLogger,
  ],
};

// export log instance based on the current environment
const instanceLogger: LoggerOptions = { ...loggerOption };
// const instanceLogger: LoggerOptions = process.env.NODE_ENV === 'production' ? { ...prodLogger } : { ...devLogger };

export const instance = createLogger(instanceLogger);
