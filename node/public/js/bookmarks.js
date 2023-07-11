import axios from 'axios';

// Account
import {handleAuth, getUsername} from './auth.js';

handleAuth();
let username = getUsername();
let isAdmin = username == "windsnow1025@gmail.com";

// Theme
import {initializeTheme} from './theme';

initializeTheme();

function displayBookmarks(bookmarks) {
    const tableBody = document.querySelector('#bookmarksTable tbody');
    // Remove all rows except the first one (the form)
    while (tableBody.children.length > 1) {
        tableBody.removeChild(tableBody.lastChild);
    }
    bookmarks.forEach(bookmark => {
        const tr = document.createElement('tr');

        // Create table data for each attribute
        const firstTitleTd = document.createElement('td');
        firstTitleTd.textContent = bookmark.first_title;
        tr.appendChild(firstTitleTd);

        const secondTitleTd = document.createElement('td');
        secondTitleTd.textContent = bookmark.second_title;
        tr.appendChild(secondTitleTd);

        const urlTd = document.createElement('td');
        urlTd.textContent = bookmark.url;
        tr.appendChild(urlTd);

        const commentTd = document.createElement('td');
        commentTd.textContent = bookmark.comment;
        tr.appendChild(commentTd);

        const urlCommentTd = document.createElement('td');
        const a = document.createElement('a');
        a.href = bookmark.url;
        a.textContent = bookmark.comment;
        urlCommentTd.appendChild(a);
        tr.appendChild(urlCommentTd);

        const buttonTd = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            if (!isAdmin) {
                alert('Only admins can edit bookmarks.');
                return;
            }
            if (editButton.textContent === 'Edit') {
                // Make the fields editable
                firstTitleTd.contentEditable = true;
                secondTitleTd.contentEditable = true;
                urlTd.contentEditable = true;
                commentTd.contentEditable = true;

                // Change the button text to 'Submit'
                editButton.textContent = 'Submit';
            } else {
                // Make the fields non-editable
                firstTitleTd.contentEditable = false;
                secondTitleTd.contentEditable = false;
                urlTd.contentEditable = false;
                commentTd.contentEditable = false;

                // Change the button text back to 'Edit'
                editButton.textContent = 'Edit';

                // Update the bookmark
                const updatedBookmark = {
                    firstTitle: firstTitleTd.textContent,
                    secondTitle: secondTitleTd.textContent,
                    url: urlTd.textContent,
                    comment: commentTd.textContent
                };
                editBookmark(bookmark.id, updatedBookmark).then(() => {
                    // reload bookmarks
                    axios.get('/api/bookmark-api/').then(res => displayBookmarks(res.data));
                });
            }
        });
        buttonTd.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            if (!isAdmin) {
                alert('Only admins can delete bookmarks.');
                return;
            }
            deleteBookmark(bookmark.id).then(() => {
                // reload bookmarks
                axios.get('/api/bookmark-api/').then(res => displayBookmarks(res.data));
            });
        });
        buttonTd.appendChild(deleteButton);
        tr.appendChild(buttonTd);

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

document.querySelector('#addButton').addEventListener('click', function () {
    if (!isAdmin) {
        alert('Only admins can add bookmarks.');
        return;
    }
    const row = document.querySelector('#addBookmarkRow');
    const bookmark = {
        firstTitle: row.children[0].textContent,
        secondTitle: row.children[1].textContent,
        url: row.children[2].textContent,
        comment: row.children[3].textContent
    };
    addBookmark(bookmark).then(() => {
        // Clear the input fields
        for (let i = 0; i < 4; i++) {
            row.children[i].textContent = '';
        }
        // Reload bookmarks
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