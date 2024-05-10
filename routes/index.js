const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { 
    NOT_FOUND_CODE,
} = require('../utils/errors');
const { login } = require('../controllers/login');
const { createUser } = require('../controllers/users');
const NotFoundError = require('../utils/errors/not-found-err');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(userRouter);
router.use(itemRouter);

router.use('*', (req, res) => {
    next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
