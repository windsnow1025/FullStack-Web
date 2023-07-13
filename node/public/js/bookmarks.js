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
        this.fetchBookmarks();
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
            // Get the template
            const templateTr = document.querySelector('tr[name="bookmarkRow"]');

            // Clone the template
            const tr = templateTr.cloneNode(true);

            // Get the td elements
            const firstTitleTd = tr.querySelector('[name="firstTitle"]');
            const secondTitleTd = tr.querySelector('[name="secondTitle"]');
            const urlTd = tr.querySelector('[name="url"]');
            const commentTd = tr.querySelector('[name="comment"]');
            const linkTd = tr.querySelector('[name="link"]');
            const linkA = linkTd.querySelector('a');
            const editButton = tr.querySelector('[name="editButton"]');
            const deleteButton = tr.querySelector('[name="deleteButton"]');

            // Set the text content
            firstTitleTd.textContent = bookmark.first_title;
            secondTitleTd.textContent = bookmark.second_title;
            urlTd.textContent = bookmark.url;
            commentTd.textContent = bookmark.comment;

            // Set the link
            linkA.href = bookmark.url;
            linkA.textContent = bookmark.comment;

            // Add event listeners
            editButton.addEventListener('click', this.editBookmark.bind(this, bookmark.id, editButton, firstTitleTd, secondTitleTd, urlTd, commentTd));
            deleteButton.addEventListener('click', this.deleteBookmark.bind(this, bookmark.id));

            // Append the row to the table
            tableBody.appendChild(tr);
        });
    }

    async fetchBookmarks() {
        let res = await axios.get('/api/bookmark-api/');
        this.bookmarks = res.data;
        this.displayBookmarks(this.bookmarks);
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

document.querySelector('#searchInput').addEventListener('input', bookmarks.filterBookmarks.bind(bookmarks));
