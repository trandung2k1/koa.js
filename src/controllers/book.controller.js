const Book = require('../models/book.model');
const Author = require('../models/author.model');
const { Types } = require('mongoose');

class BookController {
    static async getBooks(ctx) {
        try {
            const books = await Book.find();
            ctx.response.status = 200;
            ctx.body = {
                data: books,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.body = {
                message: error.message,
            };
        }
    }
    static async getABook(ctx) {
        const { id } = ctx.request.params;
        if (!Types.ObjectId.isValid(id)) {
            ctx.response.status = 400;
            ctx.body = {
                message: 'Invalid id',
            };
        } else {
            try {
                const findBook = await Book.findById(id).populate('author', '_id name');
                if (findBook) {
                    ctx.response.status = 200;
                    ctx.body = {
                        data: findBook,
                    };
                } else {
                    ctx.response.status = 404;
                    ctx.body = {
                        message: 'Book not found',
                    };
                }
            } catch (error) {
                ctx.response.status = 500;
                ctx.body = {
                    message: error.message,
                };
            }
        }
    }
    static async createBook(ctx) {
        const { name, publishedDate, genres, author } = ctx.request.body;
        if (!name || !publishedDate || !genres || !author) {
            ctx.response.status = 400;
            ctx.body = {
                message: 'Name, PublishedDate, Genres, Author is required',
            };
        } else {
            try {
                const findBook = await Book.findOne({ name });
                if (findBook) {
                    ctx.response.status = 400;
                    ctx.body = {
                        message: 'Book already exists',
                    };
                } else {
                    const newBook = new Book({
                        name,
                        publishedDate,
                        genres,
                        author,
                    });
                    const savedBook = await newBook.save();
                    const findAuthor = await Author.findById(author);
                    await findAuthor.updateOne({ $push: { books: savedBook._id } });
                    ctx.response.status = 201;
                    ctx.body = {
                        data: savedBook,
                    };
                }
            } catch (error) {
                ctx.response.status = 500;
                ctx.body = {
                    message: error.message,
                };
            }
        }
    }

    static async updateBook(ctx) {
        const { id } = ctx.request.params;
        const { name, publishedDate, genres, author } = ctx.request.body;
        if (!Types.ObjectId.isValid(id)) {
            ctx.response.status = 400;
            ctx.body = {
                message: 'Invalid id',
            };
        } else {
            try {
                const updateBook = await Book.findByIdAndUpdate(
                    id,
                    {
                        name,
                        publishedDate,
                        genres,
                        author,
                    },
                    {
                        new: true,
                    },
                );
                if (updateBook) {
                    ctx.response.status = 200;
                    ctx.body = {
                        data: updateBook,
                    };
                } else {
                    ctx.response.status = 404;
                    ctx.body = {
                        message: 'Book not found',
                    };
                }
            } catch (error) {
                ctx.response.status = 500;
                ctx.body = {
                    message: error.message,
                };
            }
        }
    }
    static async deleteBook(ctx) {
        const { id } = ctx.request.params;
        if (!Types.ObjectId.isValid(id)) {
            ctx.response.status = 400;
            ctx.body = {
                message: 'Invalid id',
            };
        } else {
            try {
                const deleteBook = await Book.deleteOne({ _id: id });
                if (deleteBook.deletedCount === 0) {
                    ctx.response.status = 404;
                    ctx.body = {
                        message: 'Book not found',
                    };
                } else {
                    await Author.updateMany({ books: id }, { $pull: { books: id } });
                    ctx.response.status = 200;
                    ctx.body = {
                        message: 'Deleted book successfully',
                    };
                }
            } catch (error) {
                ctx.response.status = 500;
                ctx.body = {
                    message: error.message,
                };
            }
        }
    }
}

module.exports = BookController;
