// logService.js

const Log = require('../models/Log');

exports.getAllLogs = async () => {
  return await Log.find();
};

exports.getLogsByLevel = async (level) => {
  return await Log.find({ level });
};

exports.getLogsByString = async (log_string) => {
  return await Log.find({ log_string });
};

exports.getLogsByTimestamp = async (timestamp) => {
  return await Log.find({ timestamp });
};

exports.getLogsBySource = async (source) => {
  return await Log.find({ 'metadata.source': source });
};
