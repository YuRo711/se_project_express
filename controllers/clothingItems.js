const Item = require('../models/clothingItem');
const { 
    SERVER_ERROR_CODE,
    NOT_FOUND_CODE,
    OK_CODE,
    BAD_REQUEST_CODE,
    SERVER_ERROR_MESSAGE
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
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(BAD_REQUEST_CODE)
                    .send({ message: err.message })
            } else {
                res.status(SERVER_ERROR_CODE)
                    .send({ message: SERVER_ERROR_MESSAGE })
            }
        });
};

const deleteItem = (req, res) => {
    const { itemId } = req.params;

    Item.findByIdAndDelete(itemId)
        .orFail(() => {
            const error = new Error();
            error.name = "NotFound";
            error.statusCode = NOT_FOUND_CODE;
            throw error;
        })
        .then(item => res.status(OK_CODE).send({ data: item }))
        .catch((err) => {
            if (err.name === 'NotFound') {
                res.status(NOT_FOUND_CODE).send({ message: "Not found error" }); 
            } else if (err.name === 'CastError') {
                res.status(BAD_REQUEST_CODE).send({ message: err.message });
            } else {
                res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
            }
        });
}

const likeItem = (req, res) => 
    {
    Item.findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
    )
        .orFail(() => {
            const error = new Error();
            error.name = "NotFound";
            error.statusCode = NOT_FOUND_CODE;
            throw error;
        })
        .catch((err) => {
            if (err.name === 'NotFound') {
                res.status(NOT_FOUND_CODE).send({ message: "Not found error" }); 
            } else if (err.name === 'CastError') {
                res.status(BAD_REQUEST_CODE).send({ message: err.message });
            } else {
                res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
            }
        });;
};

const dislikeItem = (req, res) => 
    {
    Item.findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true },
    )
        .orFail(() => {
            const error = new Error();
            error.name = "NotFound";
            error.statusCode = NOT_FOUND_CODE;
            throw error;
        })
        .catch((err) => {
            if (err.name === 'NotFound') {
                res.status(NOT_FOUND_CODE).send({ message: "Not found error" }); 
            } else if (err.name === 'CastError') {
                res.status(BAD_REQUEST_CODE).send({ message: err.message });
            } else {
                res.status(SERVER_ERROR_CODE).send({ SERVER_ERROR_MESSAGE });
            }
        });;
};

module.exports = {
    getItems,
    createItem,
    deleteItem,
    likeItem,
    dislikeItem,
};
