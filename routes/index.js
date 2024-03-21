const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');

router.use(userRouter);
router.use(itemRouter);

module.exports = router;