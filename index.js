const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');
var bodyParser = require('body-parser');
const proxy = require('./proxy');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Middleware to ignore requests for favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());

const colleges = [
    { name: "JNTUA College of Engineering, Ananthapuramu", image: "/images/logo.png" },
    { name: "JNTUA College of Engineering Pulivendula", image: "/images/logo.png" },
    { name: "Sree Vidyanikethan Engineering College - [SVEC],Tirupati", image: "/images/logo.png" },
    { name: "Sri Venkateswara University, Tirupati", image: "/images/logo.png" },
    { name: "G.Pulla Reddy Engineering College, Kurnool", image: "/images/logo.png" },
    { name: "JNTUA College of Engineering Kalikiri", image: "/images/logo.png" }
];

const students = [
    ["sandeep1903582","ganesh_jaggu","peddakotlasasikumar","SunkuSaarthak"],
    ["21", "22", "23"],
    ["31", "32", "33"],
    ["41", "42", "43"],
    ["51", "52", "53"],
    ["61", "62", "63"]
];

// Use the proxy for requests
app.use('/api',proxy);

// Fetch LeetCode User Data function
async function fetchLeetCodeUserData(username) {
    const query = {
        query: `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    profile {
                        realName
                        aboutMe
                        userAvatar
                        reputation
                        ranking
                    }
                }
            }`,
        variables: {
            username: username,
        },
    };

    const proxyUrl = "http://localhost:8080/api/";
    const apiUrl = "leetcode.com/graphql";

    const response = await fetch(proxyUrl + apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.data.matchedUser;
}

// Route for the home page
app.get('/', (req, res) => {
    res.render('index', { colleges });
});

// Route for students
app.post('/students', async (req, res) => {
    const collegeIndex = Number(req.body.college);
    const usernames = students[collegeIndex];

    try {
        // Fetch user data for each username
        const userDataPromises = usernames.map(username => fetchLeetCodeUserData(username));
        const userDataArray = await Promise.all(userDataPromises);
        console.log(userDataArray);

        // Sort users by their ranking
        const sortedUsers = userDataArray.filter(user => user).sort((a, b) => {
            return a.profile.ranking - b.profile.ranking; // Ascending order
        });

        res.render('students', { users: sortedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching user data");
    }
});

// Start server
app.listen(8080, () => {
    console.log('Server running on port 8080');
});
