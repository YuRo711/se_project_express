const bcrypt = require('bcrypt');
const User = require('../models/user');
const { 
    SERVER_ERROR_CODE,
    BAD_REQUEST_CODE,
    OK_CODE,
    SERVER_ERROR_MESSAGE,
    NOT_FOUND_CODE
} = require('../utils/errors')


const getUsers = (req, res) => {
    User.find({})
        .then(users => res.status(OK_CODE).send({ data: users }))
        .catch(() => res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE }));
};

const getUser = (req, res) => {
    const { id } = req.params;

    User.findById(id)
        .orFail(() => {
            const error = new Error();
            error.name = "NotFound";
            return Promise.reject(error);
        })
        .then(user => res.status(OK_CODE).send({ data: user }))
        .catch((err) => {
            if (err.name === 'NotFound') {
                res.status(NOT_FOUND_CODE).send({ message: "Not found error" }); 
            } else if (err.name === 'CastError') {
                res.status(BAD_REQUEST_CODE).send({ message: err.message });
            } else {
                res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
            }
        });
};

const createUser = (req, res) => {
    const { name, avatar, email, password } = req.body;
    bcrypt.hash(password, 5)
        .then((hash) => {
            User.create({ name, avatar, email, password: hash },
                (err) => {
                    if (err.code === 11000) {
                        const error = new Error();
                        error.name = 'DuplicateError';
                        error.message = 'Email already in use';
                        return Promise.reject(error);
                    }
                });
        })
        .then(user => res.status(OK_CODE).send({ data: user }))
        .catch((err) => {
            console.log(err);
            if (err.name === 'ValidationError') {
                res.status(BAD_REQUEST_CODE)
                    .send({ message: err.message });
            } else if (err.name === 'DuplicateError') {
                res.status(BAD_REQUEST_CODE)
                    .send({ message: err.message });
            } else {
                res.status(SERVER_ERROR_CODE)
                    .send({ message: SERVER_ERROR_MESSAGE });
            }
        });
};

const getCurrentUser = (req, res) => {
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
                res.status(NOT_FOUND_CODE).send({ message: "Not found error" }); 
            } else if (err.name === 'CastError') {
                res.status(BAD_REQUEST_CODE).send({ message: err.message });
            } else {
                res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
            }
        });
}

const editCurrentUser = (req, res) => {
    const { _id } = req.user;
    const changes = {};
    changes.name ??= req.body.name;
    changes.avatar ??= req.body.avatar;
    
    User.findByIdAndUpdate(_id, changes, (err, docs) => { 
        if (err) {
            if (err.name === 'NotFound') {
                res.status(NOT_FOUND_CODE).send({ message: "Not found error" }); 
            } else if (err.name === 'CastError') {
                res.status(BAD_REQUEST_CODE).send({ message: err.message });
            } else {
                res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
            }
        } 
        else { 
            res.status(OK_CODE).send({ data: new docs });
        } 
    });
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    getCurrentUser,
    editCurrentUser,
};
