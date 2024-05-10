const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { login } = require('../controllers/login');
const { createUser } = require('../controllers/users');
const NotFoundError = require('../utils/errors/not-found-err');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(userRouter);
router.use(itemRouter);

router.use('*', (next) => {
    next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
