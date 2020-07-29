const express = require('express');
const router = express.Router();
const Author = require('../models/author');

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
        //res.redirect(`authors/${newAuthor.id}`);
        res.redirect('/authors');
    } catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        });
    }
})

module.exports = router;
