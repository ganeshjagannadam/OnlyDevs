const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');
var bodyParser = require('body-parser')

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
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

const students = [
    ["11","12","13"],
    ["21","22","23"],
    ["31","32","33"],
    ["41","42","43"],
    ["51","52","53"]
]

// app.use('/', (req, res) => {
//   const url = req.url.slice(1);  // Remove the leading '/'
//   req.pipe(request(url)).pipe(res);
// });

app.get('/',(req,res) => {
    res.render('index', { colleges });
});

app.post('/students',(req,res) => {
    var college = Number(req.body.college);
    res.render('students',{students : students[college]})
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});
