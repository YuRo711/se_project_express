const mongoose = require('mongoose');
const Item = require('../models/clothingItem');
const { 
    OK_CODE,
    VALIDATION_ERROR_MESSAGE,
    NOT_FOUND_MESSAGE,
    FORBIDDEN_MESSAGE,
    ID_CAST_MESSAGE
} = require('../utils/errors');
const BadRequestError = require('../utils/errors/bad-request-err');
const NotFoundError = require('../utils/errors/not-found-err');
const ForbiddenError = require('../utils/errors/forbidden-err');


const getItems =  (req, res, next) => {
    Item.find({})
        .then(items => res.status(OK_CODE).send({ data: items }))
        .catch((err) => next(err));
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
                next(new BadRequestError(VALIDATION_ERROR_MESSAGE));
            } else {
                next(err);
            }
        });
};

const deleteItem = (req, res, next) => {
    const { itemId } = req.params;
    Item.findById(itemId)
        .orFail(() => {
            const error = new Error();
            error.name = 'NotFound';
            error.statusCode = NOT_FOUND_CODE;
            throw error;
        })
        .then((item) => {
            if (req.user._id !== String(item.owner)) {
                const error = new Error();
                error.name = 'NotAuthorized';
                throw error;
            }
            return Item.findByIdAndDelete(itemId);
        })
        .then(item => res.status(OK_CODE).send({ data: item }))
        .catch((err) => {
            if (err.name === 'NotFound') {
                next(new NotFoundError(NOT_FOUND_MESSAGE)); 
            } else if (err.name === 'CastError') {
                next(new BadRequestError(ID_CAST_MESSAGE));
            } else if (err.name === 'NotAuthorized') {
                next(new ForbiddenError(FORBIDDEN_MESSAGE));
            } else {
                next(err);
            }
        });
}

const likeItem = (req, res, next) => 
    {
    Item.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.params.itemId),
        { $addToSet: { likes: req.user._id } },
        { new: true },
    )
        .orFail(() => {
            const error = new Error();
            error.name = "NotFound";
            error.statusCode = NOT_FOUND_CODE;
            throw error;
        })
        .then(item => res.status(OK_CODE).send({ data: item }))
        .catch((err) => {
            if (err.name === 'NotFound') {
                next(new NotFoundError(NOT_FOUND_MESSAGE)); 
            } else if (err.name === 'CastError') {
                next(new BadRequestError(ID_CAST_MESSAGE));
            } else {
                next(err);
            }
        });
};

const dislikeItem = (req, res, next) => 
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
        .then(item => res.status(OK_CODE).send({ data: item }))
        .catch((err) => {
            if (err.name === 'NotFound') {
                next(new NotFoundError(NOT_FOUND_MESSAGE)); 
            } else if (err.name === 'CastError') {
                next(new BadRequestError(ID_CAST_MESSAGE));
            } else {
                next(err);
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
