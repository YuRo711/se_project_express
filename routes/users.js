const router = require('express').Router();
const { 
    getCurrentUser, editCurrentUser
} = require('../controllers/users');
const auth = require('../middlewares/auth');


router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, editCurrentUser);

module.exports = router;
