import { getLogger } from 'log4js';

const logger = getLogger();
logger.level = 'debug';

export function consoleLog(msg: string): void {
    logger.info(msg);
};

export function consoleError(msg: string): void {
    logger.error(msg);
};