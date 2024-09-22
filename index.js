const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to ignore requests for favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/', (req, res) => {
  const url = req.url.slice(1);  // Remove the leading '/'
  req.pipe(request(url)).pipe(res);
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});
