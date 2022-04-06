// https://github.com/winstonjs/winston#quick-start
import * as winston from 'winston';
import {getCaller} from '../common/util';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {
    service: 'backend',
  },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ],
});

const log = (
  message: string,
  err: unknown = '',
  fname: string = getCaller()
) => {
  const level = err ? 'error' : 'info';
  const prefix = fname ? `(${fname}) : ` : '';
  const suffix = err ? ` due to ERROR: ${err}` : '';
  logger.log(level, prefix + message + suffix);
};

export default logger;
export {log};
