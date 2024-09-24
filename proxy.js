const express = require('express');
const request = require('request');

const router = express.Router();

// Use the proxy for requests
router.use('/', (req, res) => {
    const url = req.url.slice(1); // Remove the leading '/'
    const fullUrl = `https://${url}`;
    req.pipe(request(fullUrl)).pipe(res);
});

module.exports = router;
