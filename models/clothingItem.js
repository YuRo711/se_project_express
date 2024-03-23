const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    weather: {
        type: String,
        required: true,
        enum: ['hot', 'warm', 'cold'],
    },
    imageUrl: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: 'You must enter a valid URL',
        },
    },
    owner: {
        type: ObjectId,
        required: true,
    },
    likes: {
        type: [ObjectId],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('clothingItem', itemSchema);
