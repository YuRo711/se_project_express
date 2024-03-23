const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { 
    NOT_FOUND_CODE,
} = require('../utils/errors')

router.use(userRouter);
router.use(itemRouter);

router.use('*', function(req, res){
    res.status(NOT_FOUND_CODE).send(
        { message: "Requested resource not found" }
    );
  });

module.exports = router;