const router = require('express').Router();
const { 
    getItems,
    createItem,
    deleteItem,
    likeItem,
    dislikeItem,
} = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');
const { validateCardBody, validateItemId } = require('../middlewares/validator');

router.get('/items', getItems);

router.post('/items', auth, validateCardBody, createItem);

router.delete('/items/:itemId', auth, validateItemId, deleteItem);

router.put('/items/:itemId/likes', auth, validateItemId, likeItem);

router.delete('/items/:itemId/likes', auth, validateItemId, dislikeItem);

module.exports = router;
