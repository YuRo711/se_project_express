const crypto = require('crypto');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.JWT_SECRET = 
    NODE_ENV === 'production' ? 
        JWT_SECRET : crypto.randomBytes(16).toString('hex');
