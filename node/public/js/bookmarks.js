import { getUsername } from "./auth";
import axios from 'axios';

let username = getUsername();
console.log(username);
let isAdmin = username == "windsnow1025@gmail.com";
console.log(isAdmin ? "Admin" : "User");

// Fetch bookmarks from the server
axios.get('/api/bookmarks-api/')
    .then(res => {
        // Display bookmarks
        displayBookmarks(res.data);
    })

function displayBookmarks(bookmarks) {

}