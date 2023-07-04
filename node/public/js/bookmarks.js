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
    const column1 = document.getElementById("Column1");
    const column2 = document.getElementById("Column2");
    const column3 = document.getElementById("Column3");

    bookmarks.forEach((bookmark, index) => {
        const div = document.createElement('div');
        div.textContent = `${bookmark.firstTitle} - ${bookmark.secondTitle}`;
        div.onclick = () => window.open(bookmark.url, '_blank');

        if (index % 3 === 0) {
            column1.appendChild(div);
        } else if (index % 3 === 1) {
            column2.appendChild(div);
        } else {
            column3.appendChild(div);
        }
    });
}