const crypto = require('crypto');

module.exports.JWT_SECRET = crypto.randomBytes(16)
    .toString('hex');
