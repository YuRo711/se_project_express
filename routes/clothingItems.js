const router = require('express').Router();
const { 
    getItems,
    createItem,
    deleteItem,
} = require('../controllers/clothingItems');
const { 
    NOT_FOUND_CODE
} = require('../utils/errors')

router.get('/items', getItems);

router.post('/items', createItem);

router.delete('/items/:itemId', deleteItem);

router.use((req, res, next) => {
    if (res.statusCode == NOT_FOUND_CODE) {
        res.send({
            "message": "Requested resource not found"
        });
    }
    next();
});

module.exports = router;
