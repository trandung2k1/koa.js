const { Schema, model, models } = require('mongoose');
const Book = require('./book.model')
const authorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        yearOfBirth: {
            type: Number,
        },
        books: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Book',
            },
        ],
    },
    {
        timestamps: true,
    },
);
const Author = models.Author || model('Author', authorSchema);
module.exports = Author;
