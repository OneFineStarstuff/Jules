const winston = require('winston');
const crypto = require('crypto');

/**
 * Custom Winston transport to ensure Zero-PII logging.
 * Replaces any potential PII with salted hashes.
 */
const piiFilter = winston.format((info) => {
  const salt = process.env.PII_SALT || 'default_salt';

  if (info.actor_id) {
    info.actor_hash = crypto.createHash('sha256')
      .update(info.actor_id + salt)
      .digest('hex');
    delete info.actor_id;
  }

  // Strip common PII keys
  const piiKeys = ['email', 'ssn', 'phone', 'address', 'name'];
  piiKeys.forEach(key => delete info[key]);

  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    piiFilter(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // In production, this would stream to Azure Log Analytics
  ],
});

module.exports = logger;
