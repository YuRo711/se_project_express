const router = require('express').Router();
const { 
    getItems,
    createItem,
    deleteItem,
    likeItem,
    dislikeItem,
} = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');
const { 
    NOT_FOUND_CODE
} = require('../utils/errors')

router.get('/items', getItems);

router.post('/items', auth, createItem);

router.delete('/items/:itemId', auth, deleteItem);

router.put('/items/:itemId/likes', auth, likeItem);

router.delete('/items/:itemId/likes', auth, dislikeItem);

router.use((req, res, next) => {
    if (res.statusCode === NOT_FOUND_CODE) {
        res.send({
            "message": "Requested resource not found"
        });
    }
    next();
});

module.exports = router;
