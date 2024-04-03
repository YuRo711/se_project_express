const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../utils/config');

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
                    res.send({ token: token })
                });
        })
        .catch((err) => {
            if (err.name === 'LoginError') {
                res.status(BAD_REQUEST_CODE).send({ message: err.message });
            }
        })
}

module.exports = {
    login
}
