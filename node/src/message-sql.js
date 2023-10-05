const mysql = require("mysql");
const util = require("util");

// MySQL Connection Pool
const pool = mysql.createPool({
    host: "mysql",
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
    let delay = 5000;

    await new Promise(resolve => setTimeout(resolve, delay));

    while (true) {
        try {
            await poolQuery('SELECT * FROM message');
            console.log('MessageSQL Connected!');
            break;
        } catch (err) {
            console.error('Error connecting to MessageSQL:', err);
            attempts++;
            if (attempts < maxAttempts) {
                console.log(`Attempts ${attempts + 1},Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Max attempts reached. MessageSQL connection failed.');
                throw err;
            }
        }
    }
}

testConnection();

// MySQL Functions

async function Show() {
    const sql = "SELECT * FROM message";
    const result = await poolQuery(sql);
    return result;
}

async function Store(data) {
    const sql = "INSERT INTO message (message) VALUES (?)";
    const sqlParams = [data.message];
    await poolQuery(sql, sqlParams);
    console.log("1 message inserted");
}

async function Delete(id) {
    const sql = "DELETE FROM message WHERE id = ?";
    const sqlParams = [id];
    await poolQuery(sql, sqlParams);
    console.log("1 message deleted");
}

async function DeleteAll() {
    const sql = "DELETE FROM message";
    const result = await poolQuery(sql);
    console.log("Number of messages deleted: " + result.affectedRows);
}

module.exports = {
    Show: Show,
    Store: Store,
    Delete: Delete,
    DeleteAll: DeleteAll
};