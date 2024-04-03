const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const { SERVER_ERROR_CODE, SERVER_ERROR_MESSAGE, UNAUTHORIZED_CODE } = require('../utils/errors');

const login = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }).select('+password')
        .then((user) => {            
            if (!user) {
                const error = new Error();
                error.name = 'LoginError';
                return Promise.reject(error);
            }

            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        const error = new Error();
                        error.name = 'LoginError';
                        return Promise.reject(error);
                    }
                    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
                        expiresIn: "7d",
                    });
                    res.send({ token });
                    return Promise.resolve();
                });
        })
        .catch((err) => {
            if (err.name === 'LoginError') {
                res.status(UNAUTHORIZED_CODE).send({ message: 'Login error' });
            } else {
                res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
            }
        })
}

module.exports = {
    login
}
