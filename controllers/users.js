const User = require('../models/user');
const { 
    SERVER_ERROR_CODE,
    BAD_REQUEST_CODE,
    NOT_FOUND_CODE,
    OK_CODE
} = require('../utils/errors')


const getUsers = (req, res) => {
    User.find({})
        .then(users => res.status(OK_CODE).send({ data: users }))
        .catch((err) => res.status(SERVER_ERROR_CODE).send({ message: err.message }));
};

const getUser = (req, res) => {
    const { id } = req.params;

    User.findById(id)
        .orFail(() => {
            const error = new Error("User ID not found");
            error.statusCode = NOT_FOUND_CODE;
            throw error;
        })
        .then(user => {
            return res.status(OK_CODE).send({ data: user });
        })
        .catch((err) => 
        {
            if (err.statusCode == NOT_FOUND_CODE) {
                res.status(NOT_FOUND_CODE).send({ message: err.message });
            } else {
                res.status(SERVER_ERROR_CODE).send({ message: err.message });
            }
        });
};

const createUser = (req, res) => {
    const { name, avatar } = req.body;

    User.create({ name, avatar })
        .then(user => res.status(OK_CODE).send({ data: user }))
        .catch((err) => {
            if (err.name === "ValidationError")
            {
                res.status(BAD_REQUEST_CODE).send({ message: err.message });

            } else {
                res.status(SERVER_ERROR_CODE).send({ message: err.message })
            }
        });
};

module.exports = {
    getUsers,
    getUser,
    createUser,
};
