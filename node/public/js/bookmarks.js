import {getUsername} from "./auth";
import axios from 'axios';

// Theme
import {initializeTheme} from './theme';

initializeTheme();

let username = getUsername();
console.log(username);
let isAdmin = username == "windsnow1025@gmail.com";
console.log(isAdmin ? "Admin" : "User");

function displayBookmarks(bookmarks) {
    const container = document.querySelector('div');
    bookmarks.forEach(bookmark => {
        const div = document.createElement('div');
        div.textContent = `${bookmark.first_title} - ${bookmark.second_title} - ${bookmark.url} - ${bookmark.comment}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            // code to edit this bookmark
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteBookmark(bookmark.id).then(() => {
                // reload bookmarks
                axios.get('/api/bookmark-api/').then(res => displayBookmarks(res.data));
            });
        });

        div.appendChild(editButton);
        div.appendChild(deleteButton);
        container.appendChild(div);
    });
}


function addBookmark(bookmark) {
    return axios.post('/api/bookmark-api/', bookmark);
}

function editBookmark(id, bookmark) {
    return axios.put(`/api/bookmark-api/${id}`, bookmark);
}

function deleteBookmark(id) {
    return axios.delete(`/api/bookmark-api/${id}`);
}


document.querySelector('#addBookmarkForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.target;
    const bookmark = {
        firstTitle: form.firstTitle.value,
        secondTitle: form.secondTitle.value,
        url: form.url.value,
        comment: form.comment.value
    };
    addBookmark(bookmark).then(() => {
        form.reset();
        // reload bookmarks
        axios.get('/api/bookmark-api/').then(res => displayBookmarks(res.data));
    }).catch(error => {
        console.error('Error adding bookmark:', error);
    });
});


window.onload = function () {
    // Fetch bookmarks from the server on window load
    axios.get('/api/bookmark-api/').then(res => {
        // Display bookmarks
        displayBookmarks(res.data);
    }).catch(error => {
        console.error('Error fetching bookmarks:', error);
    });
};
