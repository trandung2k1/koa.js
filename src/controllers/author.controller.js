const Author = require('../models/author.model');
const Book = require('../models/book.model');
const { Types } = require('mongoose');
class AuthorController {
    static async getAuthors(ctx) {
        try {
            const authors = await Author.find();
            ctx.response.status = 200;
            ctx.body = {
                data: authors,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.body = {
                message: error.message,
            };
        }
    }
    static async getAnAuthor(ctx) {
        const { id } = ctx.request.params;
        if (!Types.ObjectId.isValid(id)) {
            ctx.response.status = 400;
            ctx.body = {
                message: 'Invalid id',
            };
        } else {
            try {
                const findAuthor = await Author.findById(id).populate('books', '_id name');
                if (findAuthor) {
                    ctx.response.status = 200;
                    ctx.body = { data: findAuthor };
                } else {
                    ctx.response.status = 404;
                    ctx.body = {
                        message: 'Author not found',
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
    static async createAuthors(ctx) {
        const { name, yearOfBirth } = ctx.request.body;
        if (!name || !yearOfBirth) {
            ctx.response.status = 400;
            ctx.body = { message: 'Name and Year of Birth is required' };
        } else {
            try {
                const findAuthor = await Author.findOne({ name });
                if (findAuthor) {
                    ctx.response.status = 400;
                    ctx.body = {
                        message: 'Author already exists',
                    };
                } else {
                    ctx.response.status = 201;
                    const newAuthor = new Author({
                        name,
                        yearOfBirth,
                    });
                    const savedAuthor = await newAuthor.save();
                    ctx.body = savedAuthor;
                }
            } catch (error) {
                ctx.response.status = 500;
                ctx.body = {
                    message: error.message,
                };
            }
        }
    }
    static async updateAuthorById(ctx) {
        const { id } = ctx.request.params;
        const { name, yearOfBirth } = ctx.request.body;
        if (!Types.ObjectId.isValid(id)) {
            ctx.response.status = 400;
            ctx.body = {
                message: 'Invalid id',
            };
        } else {
            try {
                const updateAuthor = await Author.findByIdAndUpdate(
                    id,
                    {
                        name,
                        yearOfBirth,
                    },
                    {
                        new: true,
                    },
                );
                if (!updateAuthor) {
                    ctx.response.status = 404;
                    ctx.body = {
                        message: 'Author not found',
                    };
                } else {
                    ctx.response.status = 200;
                    ctx.body = {
                        data: updateAuthor,
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
    static async deleteAuthorById(ctx) {
        const { id } = ctx.request.params;
        if (!Types.ObjectId.isValid(id)) {
            ctx.response.status = 400;
            ctx.body = {
                message: 'Invalid id',
            };
        } else {
            const deleteAuthor = await Author.deleteOne({ _id: id });
            if (deleteAuthor.deletedCount === 0) {
                ctx.response.status = 404;
                ctx.body = {
                    message: 'Author not found',
                };
            } else {
                await Book.updateMany({ author: id }, { author: null });
                ctx.response.status = 200;
                ctx.body = {
                    message: 'Deleted author successfully',
                };
            }
            try {
            } catch (error) {
                ctx.response.status = 500;
                ctx.body = {
                    message: error.message,
                };
            }
        }
    }
}

module.exports = AuthorController;
