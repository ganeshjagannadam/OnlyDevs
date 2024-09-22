
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

    const proxyUrl = "http://localhost:8080/";
    const apiUrl = "https://leetcode.com/graphql";

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

async function displayUserInfo() {
    const username = document.getElementById("username").value;
    const userDiv = document.getElementById("user-info");

    if (!username) {
        userDiv.innerHTML = "<p>Please enter a username!</p>";
        return;
    }

    try {
        const userInfo = await fetchLeetCodeUserData(username);

        if (userInfo) {
        userDiv.innerHTML = `
                    <p><strong>Username:</strong> ${userInfo.username}</p>
                    <p><strong>Real Name:</strong> ${
                        userInfo.profile.realName || "N/A"
                    }</p>
                    <p><strong>About Me:</strong> ${
                        userInfo.profile.aboutMe || "N/A"
                    }</p>
                    <p><strong>Reputation:</strong> ${
                        userInfo.profile.reputation
                    }</p>
                    <p><strong>Ranking:</strong> ${
                        userInfo.profile.ranking
                    }</p>
                    <img src="${
                        userInfo.profile.userAvatar
                    }" alt="User Avatar" width="100" height="100">
                `;
        } else {
        userDiv.innerHTML = "<p>User not found!</p>";
        }
    } catch (error) {
        userDiv.innerHTML = "<p>Error fetching data: ${error.message}</p>";
    }
}