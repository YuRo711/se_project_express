const Item = require('../models/clothingItem');


const getItems =  (req, res) => {
    Item.find({})
        .then(items => res.send({ data: items }))
        .catch(() => res.status(500).send({ message: 'Server error' }));
};

const createItem = (req, res) => {
    const { name, weather, imageUrl } = req.body;

    Item.create(
            { name, weather, imageUrl, owner: undefined }
        )
        .then(item => res.send({ data: item }))
        .catch(() => res.status(500).send({ message: 'Server error' }));
};

const deleteItem = (req, res) => {
    const { id } = req.params;

    Item.findByIdAndDelete(id)
        .then(item => {
            if (!item) {
                return res.status(404).send({ message: 'Item does not exist' });
            } else {
                return res.send({ data: item });
            }
        })
        .catch(() => res.status(500).send({ message: 'Server error' }));
}

module.exports = {
    getItems,
    createItem,
    deleteItem,
};
