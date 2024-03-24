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
            error.statusCode = NOT_FOUND_CODE;
            throw error;
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
    const { name, avatar } = req.body;

    User.create({ name, avatar })
        .then(user => res.status(OK_CODE).send({ data: user }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(BAD_REQUEST_CODE)
                    .send({ message: err.message })
            } else {
                res.status(SERVER_ERROR_CODE)
                    .send({ message: SERVER_ERROR_MESSAGE })
            }
        });
};

module.exports = {
    getUsers,
    getUser,
    createUser,
};
