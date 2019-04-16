"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js_1 = require("log4js");
var logger = log4js_1.getLogger();
logger.level = 'debug';
function consoleLog(msg) {
    logger.info(msg);
}
exports.consoleLog = consoleLog;
;
function consoleError(msg) {
    logger.error(msg);
}
exports.consoleError = consoleError;
;
