const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { 
    NOT_FOUND_CODE,
} = require('../utils/errors');
const { login } = require('../controllers/login');
const { createUser } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(userRouter);
router.use(itemRouter);

router.use('*', (req, res) => {
    res.status(NOT_FOUND_CODE).send(
        { message: "Requested resource not found" }
    );
});

module.exports = router;
