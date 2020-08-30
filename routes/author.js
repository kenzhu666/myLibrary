const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

// All authors route
router.get('/', async (req, res) => {
    let searchAuthor = {};
    if (req.query.name != null && req.query.name !== '') {
        searchAuthor.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchAuthor);
        res.render('authors/index', { authors: authors, searchAuthor: req.query });
    } catch{
        res.redirect('/');
    }
})

// New author route
router.get('/new', (req, res) => {
    // 在前端直接用author就可以
    res.render('authors/new', { author: new Author() });
})

// Create author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`);
    } catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        });
    }
})




// 1. 显示作者
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch{
        res.redirect('/');
    }
})

// 2. 更改作者
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author });
    } catch{
        res.redirect('/authors');
    }
})

// 3. 更新作者
router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch{
        if (author == null) {
            res.redirect('/');
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error Updating author'
            });
        }
    }
})

// 4. 删除作者
router.delete('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    } catch{
        if (author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`);
        }
    }
})






module.exports = router;
