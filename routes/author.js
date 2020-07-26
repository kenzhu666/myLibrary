const express = require('express');
const author = express.Router();

// All authors route
author.get('/', (req, res) => {
    res.render('authors/index');
})

// New author route
author.get('/new', (req, res) => {
    res.render('/authors/new');
})

// Create author route
author.post('/', (req, res) => {
    res.send('create');
})

module.exports = author;
