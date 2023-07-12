import axios from 'axios';

// Account
import {handleAuth, getUsername} from './auth.js';

handleAuth();
let username = getUsername();
let isAdmin = username == "windsnow1025@gmail.com";

// Theme
import {initializeTheme} from './theme';

initializeTheme();

class Bookmarks {
    constructor() {
        this.bookmarks = [];
    }

    displayBookmarks(bookmarks) {
        // Sort bookmarks by firstTitle, then secondTitle, then comment
        bookmarks.sort((a, b) => {
            if (a.first_title < b.first_title) return -1;
            if (a.first_title > b.first_title) return 1;
            if (a.second_title < b.second_title) return -1;
            if (a.second_title > b.second_title) return 1;
            if (a.comment < b.comment) return -1;
            if (a.comment > b.comment) return 1;
            return 0;
        });

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
            editButton.addEventListener('click', this.editBookmark.bind(this, bookmark.id, editButton, firstTitleTd, secondTitleTd, urlTd, commentTd));
            buttonTd.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', this.deleteBookmark.bind(this, bookmark.id));
            buttonTd.appendChild(deleteButton);
            tr.appendChild(buttonTd);

            tableBody.appendChild(tr);
        });
    }

    async addBookmark() {
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
        await axios.post('/api/bookmark-api/', bookmark);

        // Clear the input fields
        for (let i = 0; i < 4; i++) {
            row.children[i].textContent = '';
        }

        // reload bookmarks
        let res = await axios.get('/api/bookmark-api/');
        this.bookmarks = res.data;

        // filter bookmarks
        this.filterBookmarks();

    }

    async editBookmark(id, editButton, firstTitleTd, secondTitleTd, urlTd, commentTd) {
        if (!isAdmin) {
            alert('Only admins can edit bookmarks.');
            return;
        }
        if (editButton.textContent === 'Edit') {
            // Make the fields editable
            firstTitleTd.contentEditable = "plaintext-only";
            secondTitleTd.contentEditable = "plaintext-only";
            urlTd.contentEditable = "plaintext-only";
            commentTd.contentEditable = "plaintext-only";

            // Change the button text to 'Submit'
            editButton.textContent = 'Submit';
        } else {
            // Make the fields non-editable
            firstTitleTd.contentEditable = "false";
            secondTitleTd.contentEditable = "false";
            urlTd.contentEditable = "false";
            commentTd.contentEditable = "false";

            // Change the button text back to 'Edit'
            editButton.textContent = 'Edit';

            // Update the bookmark
            const updatedBookmark = {
                firstTitle: firstTitleTd.textContent,
                secondTitle: secondTitleTd.textContent,
                url: urlTd.textContent,
                comment: commentTd.textContent
            };
            await axios.put(`/api/bookmark-api/${id}`, updatedBookmark);

            // reload bookmarks
            let res = await axios.get('/api/bookmark-api/');
            this.bookmarks = res.data;

            // filter bookmarks
            this.filterBookmarks();
        }

    }

    async deleteBookmark(id) {
        if (!isAdmin) {
            alert('Only admins can delete bookmarks.');
            return;
        }
        await axios.delete(`/api/bookmark-api/${id}`);
        // reload bookmarks
        let res = await axios.get('/api/bookmark-api/');
        this.bookmarks = res.data;

        // filter bookmarks
        this.filterBookmarks();
    }

    filterBookmarks() {
        // Get the search input element
        const searchInput = document.querySelector('#searchInput');
        // Get the search term
        const searchTerm = searchInput.value.toLowerCase();

        // Filter the bookmarks
        const filteredBookmarks = this.bookmarks.filter(bookmark => {
            // Check if the search term is in the first title, second title, url or comment
            return bookmark.first_title.toLowerCase().includes(searchTerm) ||
                bookmark.second_title.toLowerCase().includes(searchTerm) ||
                bookmark.url.toLowerCase().includes(searchTerm) ||
                bookmark.comment.toLowerCase().includes(searchTerm);
        });

        // Display the filtered bookmarks
        bookmarks.displayBookmarks(filteredBookmarks);
    }

}

const bookmarks = new Bookmarks();

document.querySelector('#addButton').addEventListener('click', bookmarks.addBookmark.bind(bookmarks));

window.onload = function () {
    // Fetch bookmarks from the server on window load
    axios.get('/api/bookmark-api/').then(res => {
        // Display bookmarks
        bookmarks.bookmarks = res.data;
        bookmarks.displayBookmarks(res.data);
    }).catch(error => {
        console.error('Error fetching bookmarks:', error);
    });
};

// Get the search input element
const searchInput = document.querySelector('#searchInput');
// Add an event listener to the search input
searchInput.addEventListener('input', bookmarks.filterBookmarks.bind(bookmarks));
