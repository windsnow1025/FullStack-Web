import { getUsername } from "./auth";
import axios from 'axios';

let username = getUsername();
let isAdmin = username == "windsnow1025@gmail.com";
console.log(isAdmin ? "Admin" : "User");

// Fetch bookmarks from the server
axios.get('/api/bookmarks-api/' + username)
    .then(response => {
        let bookmarks = response.data;
        let column1 = document.getElementById('Column1');
        bookmarks.forEach(bookmark => {
            let div = document.createElement('div');
            div.textContent = bookmark.title;
            div.onclick = () => window.open(bookmark.url, '_blank');
            if (isAdmin) {
                div.oncontextmenu = (event) => {
                    event.preventDefault();
                    let newTitle = prompt('Enter new title', bookmark.title);
                    let newUrl = prompt('Enter new URL', bookmark.url);
                    if (newTitle && newUrl) {
                        // Update bookmark on the server
                        axios.put('/api/bookmarks/' + bookmark.id, { title: newTitle, url: newUrl })
                            .then(() => {
                                // Update bookmark on the page
                                div.textContent = newTitle;
                                div.onclick = () => window.open(newUrl, '_blank');
                            })
                            .catch(console.error);
                    }
                };
            }
            column1.appendChild(div);
        });
    })
    .catch(console.error);

function RowShow(NumberInRow) {
    //Count the amount of divs in row
    var RowDocument = document.getElementById("Row");
    var RowTotal = RowDocument.getElementsByTagName('div').length;
    for (let i = 1; i <= RowTotal; i++) {
        var ChangeDivID = "Column" + i.toString();
        var ChangeDivDocument = document.getElementById(ChangeDivID);
        if (i != NumberInRow) {
            //Hide other divs in column
            ChangeDivDocument.style.display = "none";
            //Hide other divs in main
            ColumnShow(i, 0);
        }
        else {
            //Show the current div in column
            ChangeDivDocument.style.display = "block";
            //Show the first div in main corresponding to the current div in column
            ColumnShow(i, 1);
        }
    }
}

function ColumnShow(Row, NumberInColumn) {
    //Count the amount of divs in column
    ColumnDocument = document.getElementById("Column" + Row.toString());
    ColumnTotal = ColumnDocument.getElementsByTagName('div').length;
    for (let i = 1; i <= ColumnTotal; i++) {
        var ChangeDivID = "Main" + Row.toString() + "-" + i.toString();
        var ChangeDivDocument = document.getElementById(ChangeDivID);
        if (i != NumberInColumn) {
            //Hide divs in main
            ChangeDivDocument.style.display = "none";
        }
        else {
            //Show the current div in main
            ChangeDivDocument.style.display = "block";
        }
    }
}

