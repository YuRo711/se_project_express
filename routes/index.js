const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { login } = require('../controllers/login');
const { createUser } = require('../controllers/users');
const NotFoundError = require('../utils/errors/not-found-err');
const { validateUserLogin, validateUserData } = require('../middlewares/validator');

router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserData, createUser);

router.use(userRouter);
router.use(itemRouter);

router.use('*', (req, res, next) => {
    next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
