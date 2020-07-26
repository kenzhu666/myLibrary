const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('That is the router');
})

module.exports = router;