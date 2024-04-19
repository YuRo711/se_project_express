const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_CODE } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

const handleAuthError = (res) => {
    res.status(UNAUTHORIZED_CODE)
        .send({ message: 'Authorization Error' });
};

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return handleAuthError(res);
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.log(err);
        return handleAuthError(res);
    }

    req.user = payload;

    return next();
};
