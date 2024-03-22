const Item = require('../models/clothingItem');
const { 
    SERVER_ERROR_CODE,
    NOT_FOUND_CODE,
    OK_CODE
} = require('../utils/errors')


const getItems =  (req, res) => {
    Item.find({})
        .then(items => res.status(OK_CODE).send({ data: items }))
        .catch((err) => res.status(SERVER_ERROR_CODE).send({ message: err.message }));
};

const createItem = (req, res) => {
    const owner = req.user._id;
    const { name, weather, imageUrl } = req.body;

    Item.create(
            { name, weather, imageUrl, owner }
        )
        .then(item => res.status(OK_CODE).send({ data: item }))
        .catch((err) => res.status(SERVER_ERROR_CODE)
            .send({ message: err.message }));
};

const deleteItem = (req, res) => {
    const { id } = req.params;

    Item.findByIdAndDelete(id)
        .orFail(() => {
            const error = new Error("Item ID not found");
            error.statusCode = 404;
            throw error;
        })
        .then(item => {
            return res.status(OK_CODE).send({ data: item });
        })
        .catch((err) => {
            if (err.statusCode == NOT_FOUND_CODE) {
                res.status(NOT_FOUND_CODE).send({ message: err.message });
            } else {
                res.status(SERVER_ERROR_CODE).send({ message: err.message });
            }
        });
}

const likeItem = (req, res) => 
    {
    Item.findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
    );
};

const dislikeItem = (req, res) => 
    {
    Item.findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true },
    )
        .orFail(() => {
            const error = new Error("Item ID not found");
            error.statusCode = 404;
            throw error;
        });
};

module.exports = {
    getItems,
    createItem,
    deleteItem,
    likeItem,
    dislikeItem,
};
