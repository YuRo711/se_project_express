const router = require('express').Router();
const { 
    getCurrentUser, editCurrentUser
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { 
    NOT_FOUND_CODE
} = require('../utils/errors')


router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, editCurrentUser);

router.use((req, res, next) => {
    if (res.statusCode === NOT_FOUND_CODE) {
        res.send({
            "message": "Requested resource not found"
        });
    }
    next();
});

module.exports = router;
