const router = require('express').Router();
const { 
    getCurrentUser, editCurrentUser
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserEdit } = require('../middlewares/validator');


router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, validateUserEdit, editCurrentUser);

module.exports = router;
