const mongoose = require("mongoose");

const BooksSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: [true, "Please provide the title"],
    },
    isbn: {
        type: String,
    },
    pageCount: {
        type: Number,
        required: [true, 1],
    },
    publishedDate: {
        type: Object,
    },
    thumbnailUrl: {
        type: String,
    },
    shortDescription: {
        type: String,
    },
    longDescription: {
        type: String,
    },
    status: {
        type: String,
    },
    authors: {
        type: Array,
    },
    categories: {
        type: Array,
    },
});

module.exports = mongoose.model("BooksLibrary", BooksSchema);
