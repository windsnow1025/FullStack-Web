import { getUsername } from "./auth";

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

let username = getUsername();
if (username == "windsnow1025@gmail.com") {
    console.log("Admin");
}