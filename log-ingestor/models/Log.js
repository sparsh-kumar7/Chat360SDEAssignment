// Log.js

const mongoose = require('mongoose');
const { logLevels } = require('../config/loggingConfig');

const logSchema = new mongoose.Schema({
  level: { type: String, enum: logLevels, required: true },
  log_string: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object }
});

module.exports = mongoose.model('Log', logSchema);
