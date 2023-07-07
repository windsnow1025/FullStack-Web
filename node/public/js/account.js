import axios from "axios";

// Theme
import { initializeTheme } from './theme.js';
initializeTheme();

class Account {
    constructor() {
        this.prompt = document.getElementById("prompt");
        this.username = null;
        this.password = null;
    }

    getData() {
        this.username = document.getElementById("username").value;
        this.password = document.getElementById("password").value;
    }

    async login() {
        this.getData();
        try {
            let res = await axios.post("/api/user-api/login", {
                data: { username: this.username, password: this.password }
            });
            // Save token
            localStorage.setItem('token', res.data.token);
            alert("Login Success");
            window.history.back();
        } catch (err) {
            if (err.response.status == 401) {
                alert("Invalid Username or Password");
            } else {
                alert("Login Fail");
                console.error(err);
            }
        }
    }

    isValidInput(input) {
        // Check if input contains only ASCII characters and has a length between 6 and 20
        const asciiRegex = /^[\x00-\x7F]{4,32}$/;
        return asciiRegex.test(input);
    }

    async signup() {
        this.getData();
        if (!this.isValidInput(this.username) || !this.isValidInput(this.password)) {
            alert("Username or Password contains invalid characters or has an invalid length.");
            return;
        }
        try {
            let res = await axios.post("/api/user-api/signup", {
                data: { username: this.username, password: this.password }
            });
            alert("Signup Success");
            window.history.back();
        } catch (err) {
            if (err.response.status == 401) {
                alert("Username already exists.");
            } else {
                alert("Signup Fail");
                console.error(err);
            }
        }
    }
}


var account = new Account();
var loginButton = document.getElementById("login");
var signupButton = document.getElementById("signup");
loginButton.onclick = account.login.bind(account);
signupButton.onclick = account.signup.bind(account);

// Bind Enter to login
document.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        loginButton.click();
    }
});