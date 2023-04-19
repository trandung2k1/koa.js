const { Schema, model, models } = require('mongoose');
const Author = require('./author.model');
const bookSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        publishedDate: {
            type: String,
        },
        genres: {
            type: [String],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Author',
        },
    },
    {
        timestamps: true,
    },
);
const Book = models.Book || model('Book', bookSchema);
module.exports = Book;
