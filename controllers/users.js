const User = require('../models/user');


const getUsers =  (req, res) => {
    User.find({})
        .then(users => res.send({ data: users }))
        .catch(() => res.status(500).send({ message: 'Server error' }));
};

const getUser = (req, res) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'User does not exist' });
            } else {
                return res.send({ data: user });
            }
        })
        .catch(() => res.status(500).send({ message: 'Server error' }));
};

const createUser = (req, res) => {
    const { name, avatar } = req.body;

    User.create({ name, avatar })
        .then(user => res.send({ data: user }))
        .catch(() => res.status(500).send({ message: 'Server error' }));
};

module.exports = {
    getUsers,
    getUser,
    createUser,
};
