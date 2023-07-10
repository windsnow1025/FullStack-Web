import {getUsername} from "./auth";

let username = getUsername();
if (username == "windsnow1025@gmail.com") {
    console.log("Admin");
} else {
    console.log("User");
}

function displayRow(rowIndex) {
    // Count the amount of divs in row
    const rowDiv = document.getElementById("Row");
    const rowNumber = rowDiv.getElementsByTagName('div').length;
    for (let i = 1; i <= rowNumber; i++) {
        var currentDivId = "Column" + i.toString();
        var currentDiv = document.getElementById(currentDivId);
        if (i != rowIndex) {
            // Hide div in column
            currentDiv.style.display = "none";
            // Hide div in main
            displayColumn(i, 0);
        } else {
            // Show div in column
            currentDiv.style.display = "block";
            // Show the first div in main corresponding to the current div in column
            displayColumn(i, 1);
        }
    }
}

function displayColumn(rowIndex, columnIndex) {
    // Count the amount of divs in column
    const columnDiv = document.getElementById("Column" + rowIndex.toString());
    const columnNumber = columnDiv.getElementsByTagName('div').length;
    for (let i = 1; i <= columnNumber; i++) {
        let currentDivId = "Main" + rowIndex.toString() + "-" + i.toString();
        var currentDiv = document.getElementById(currentDivId);
        if (i != columnIndex) {
            // Hide in main
            currentDiv.style.display = "none";
        } else {
            // Show in main
            currentDiv.style.display = "block";
        }
    }
}

// Add event listeners for Row
let rowDiv = document.getElementById("Row");
let divs = rowDiv.getElementsByTagName('div');
for (let i = 0; i < divs.length; i++) {
    divs[i].onclick = function () {
        displayRow(i + 1);
    }
}

// Add event listeners for Column
let item2 = document.getElementsByClassName("item2")[0];
let columns = item2.getElementsByTagName('div');
for (let i = 0; i < columns.length; i++) {
    if (columns[i].id.includes("Column")) {
        let divs = columns[i].getElementsByTagName('div');
        for (let j = 0; j < divs.length; j++) {
            divs[j].onclick = function () {
                let currentRowIndex = Math.floor(i / rowDiv.getElementsByTagName('div').length) + 1;
                let currentColumnIndex = i - (currentRowIndex - 1) * rowDiv.getElementsByTagName('div').length + 1;
                displayColumn(currentColumnIndex, j + 1);
            }
        }
    }
}