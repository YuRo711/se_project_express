const router = require('express').Router();
const { 
    getUsers,
    getUser,
    createUser,
} = require('../controllers/users');
const { 
    NOT_FOUND_CODE
} = require('../utils/errors')

router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.post('/users', createUser);

router.use((req, res, next) => {
    if (res.statusCode === NOT_FOUND_CODE) {
        res.send({
            "message": "Requested resource not found"
        });
    }
    next();
});

module.exports = router;
