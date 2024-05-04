const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
    OK_CODE,
    VALIDATION_ERROR_MESSAGE,
    NOT_FOUND_MESSAGE,
    ID_CAST_MESSAGE,
} = require('../utils/errors')
const BadRequestError = require('../utils/errors/bad-request-err');
const NotFoundError = require('../utils/errors/not-found-err');
const ConflictError = require('../utils/errors/conflict-err');


const createUser = (req, res, next) => {
    const { name, avatar, email, password } = req.body;
    console.log(password);
    bcrypt.hash(password, 5)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then(() => res.status(OK_CODE).send({ data: { name, avatar, email } }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError(VALIDATION_ERROR_MESSAGE));
            } else if (err.code === 11000) {
                next(new ConflictError('A user with this email already exists'));
            } else {
                next(err);
            }
        });
};

const getCurrentUser = (req, res, next) => {
    const { _id } = req.user;

    User.findById(_id)
        .orFail(() => {
            const error = new Error();
            error.name = "NotFound";
            return Promise.reject(error);
        })
        .then(user => res.status(OK_CODE).send({ data: user }))
        .catch((err) => {
            if (err.name === 'NotFound') {
                next(NotFoundError(NOT_FOUND_MESSAGE));
            } else if (err.name === 'CastError') {
                next(BadRequestError(ID_CAST_MESSAGE))
            } else {
                next(err);
            }
        });
}

const editCurrentUser = (req, res, next) => {
    const { _id } = req.user;
    const changes = {};
    changes.name ??= req.body.name;
    changes.avatar ??= req.body.avatar;
    
    User.findByIdAndUpdate(_id, changes, { new: true, runValidators: true })
        .then((user) => {
            const { name, avatar, email } = user;
            res.status(OK_CODE).send({ data: { name, avatar, email} });
        })
        .catch((err) => {
            if (err.name === 'NotFound') {
                next(NotFoundError(NOT_FOUND_MESSAGE));
            } else if (err.name === 'CastError') {
                next(BadRequestError(ID_CAST_MESSAGE))
            } else if (err.name === 'ValidationError') {
                next(new BadRequestError(VALIDATION_ERROR_MESSAGE));
            } else {
                next(err);
            }
    });
}

module.exports = {
    createUser,
    getCurrentUser,
    editCurrentUser,
};
