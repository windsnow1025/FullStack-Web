const mysql = require("mysql");
const util = require("util");

// MySQL Connection Pool
const pool = mysql.createPool({
    host: "sql",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// MySQL Promisify
const poolQuery = util.promisify(pool.query).bind(pool);

// MySQL Connection Test
async function testConnection() {
    let attempts = 0;
    let maxAttempts = 5;
    let delay = 4000;

    await new Promise(resolve => setTimeout(resolve, delay));
    
    while (true) {
        try {
            await poolQuery('SELECT * FROM bookmarks');
            console.log('BookmarkSQL Connected!');
            break;
        } catch (err) {
            console.error('Error connecting to BookmarkSQL:', err);
            attempts++;
            if (attempts < maxAttempts) {
                console.log(`Attempts ${attempts + 1},Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Max attempts reached. BookmarkSQL connection failed.');
                throw err;
            }
        }
    }
}

testConnection();

// MySQL Functions

async function Show() {
    let sql = "SELECT * FROM bookmarks";
    let result = await poolQuery(sql);
    return result;
}

async function Store(firstTitle, secondTitle, url, comment) {
    let sql = "INSERT INTO bookmarks (first-title, second-title, url, comment) VALUES (?,?,?,?)";
    await poolQuery(sql, [firstTitle, secondTitle, url, comment]);
    console.log("1 bookmark inserted");
}

async function Update(id, firstTitle, secondTitle, url, comment) {
    let sql = "UPDATE bookmarks SET first-title = ?, second-title = ?, url = ?, comment = ? WHERE id = ?";
    await poolQuery(sql, [firstTitle, secondTitle, url, comment, id]);
    console.log("1 bookmark updated");
}

async function Delete(id) {
    let sql = "DELETE FROM bookmarks WHERE id = ?";
    await poolQuery(sql, [id]);
    console.log("1 bookmark deleted");
}

module.exports = {
    Show: Show,
    Store: Store,
    Update: Update,
    Delete: Delete
};