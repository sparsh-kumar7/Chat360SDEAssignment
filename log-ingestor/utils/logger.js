// logger.js

const fs = require('fs');
const { logFilePaths } = require('../config/loggingConfig');

const writeLog = (level, log_string, metadata) => {
  const log = {
    level,
    log_string,
    timestamp: new Date(),
    metadata
  };
  const filePath = logFilePaths[level];
  fs.appendFileSync(filePath, JSON.stringify(log) + '\n');
};

module.exports = {
  writeLog
};
