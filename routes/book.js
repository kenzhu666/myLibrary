const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');


//const path = require('path');
//const uploadPath = path.join('public', Book.coverImagePath);

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];
/*
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});
*/

//const fs = require('fs');

// All books route
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter);
    }
    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchBooks: req.query
        })
    } catch{

    }
})

// New book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create book route
router.post('/', async (req, res) => {
    //const filename = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        // coverImageName: filename,
        description: req.body.description
    })

    saveCover(book, req.body.cover);


    try {
        const newBook = await book.save();
        res.redirect('books');
    }
    catch{
        /*
        if (book.coverImageName != 'null') {
            removeBookCover(book.coverImageName);
        }
        */
        renderNewPage(res, book, true);
    }
})

/*
function removeBookCover(filename) {
    fs.unlink(path.join(uploadPath, filename), err => {
        if (err) console.error(err)
    })
}
*/

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };
        if (hasError) params.errorMessage = 'Error creating book';
        res.render('books/new', params);
    } catch{
        res.redirect('/books');
    }
}


function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}

module.exports = router;
