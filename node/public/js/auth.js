export function getToken() {
    return localStorage.getItem('token');
}

export function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export function getUsername() {
    const token = getToken();
    if (token) {
        const payload = parseJwt(token);
        return payload.sub;
    }
    return null;
}

export function handleAuth() {
    // Get elements
    const loginButton = document.getElementById("loginButton");
    const loggedInUsername = document.getElementById("loggedInUsername");
    const SignOutButton = document.getElementById("SignOutButton");

    // Add event listeners
    SignOutButton.onclick = function () {
        localStorage.removeItem('token');
        location.reload();
    };

    // Check if user is logged in
    const username = getUsername();

    // If user is logged in, show username and SignOut button
    if (username) {
        // Hide login button
        loginButton.style.display = "none";
        // Show username
        loggedInUsername.style.display = "block";
        loggedInUsername.innerHTML = username;
        // Show SignOut button
        SignOutButton.style.display = "block";
    }
}