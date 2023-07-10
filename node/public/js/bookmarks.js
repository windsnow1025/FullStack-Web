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
    const tableBody = document.querySelector('#bookmarksTable tbody');
    tableBody.innerHTML = ''; // Clear the table body
    bookmarks.forEach(bookmark => {
        const tr = document.createElement('tr');

        // Create table data for each attribute
        const firstTitleTd = document.createElement('td');
        firstTitleTd.textContent = bookmark.first_title;
        tr.appendChild(firstTitleTd);

        const secondTitleTd = document.createElement('td');
        secondTitleTd.textContent = bookmark.second_title;
        tr.appendChild(secondTitleTd);

        const urlCommentTd = document.createElement('td');
        const a = document.createElement('a');
        a.href = bookmark.url;
        a.textContent = bookmark.comment;
        urlCommentTd.appendChild(a);
        tr.appendChild(urlCommentTd);

        const editButtonTd = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            // code to edit this bookmark
        });
        editButtonTd.appendChild(editButton);
        tr.appendChild(editButtonTd);

        const deleteButtonTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteBookmark(bookmark.id).then(() => {
                // reload bookmarks
                axios.get('/api/bookmark-api/').then(res => displayBookmarks(res.data));
            });
        });
        deleteButtonTd.appendChild(deleteButton);
        tr.appendChild(deleteButtonTd);

        tableBody.appendChild(tr);
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
