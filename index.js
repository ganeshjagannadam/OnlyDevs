const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Middleware to ignore requests for favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());


const colleges = [
    "JNTUA College of Engineering, Ananthapuramu",
    "JNTUA College of Engineering Pulivendula",
    "Sree Vidyanikethan Engineering College - [SVEC],Tirupati",
    "Sri Venkateswara University, Tirupati",
    "G.Pulla Reddy Engineering College, Kurnool"
]

// app.use('/', (req, res) => {
//   const url = req.url.slice(1);  // Remove the leading '/'
//   req.pipe(request(url)).pipe(res);
// });

app.get('/',(req,res) => {
    res.render('index', { colleges });
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});
