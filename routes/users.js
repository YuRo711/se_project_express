const router = require('express').Router();
const { 
    getUsers,
    getUser,
    createUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.post('/users', createUser);

router.use((req, res, next) => {
    if (res.statusCode == 404) {
        res.send({
            "message": "Requested resource not found"
        });
    }
    next();
});

module.exports = router;
