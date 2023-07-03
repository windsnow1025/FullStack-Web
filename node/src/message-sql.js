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
            await poolQuery('SELECT * FROM messages');
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

async function Show(callback) {
    try {
        let sql = "SELECT * FROM messages";
        let result = await poolQuery(sql);
        return result;
    } catch (err) {
        console.error("Error in Show function:", err);
        throw err;
    }
}

async function Store(data) {
    try {
        var message = data.message;
        let sql = "INSERT INTO messages (message) VALUES (?)";
        let sqldata = message;
        await poolQuery(sql, sqldata);
        console.log("1 record inserted");
    } catch (err) {
        console.error("Error in Store function:", err);
        throw err;
    }
}

async function Delete(id) {
    try {
        var sql = "DELETE FROM messages WHERE id = ?";
        var sqldata = id;
        let result = await poolQuery(sql, sqldata);
        console.log("Number of records deleted: " + result.affectedRows);
    } catch (err) {
        console.error("Error in Delete function:", err);
        throw err;
    }
}

async function DeleteAll() {
    try {
        let sql = "DELETE FROM messages";
        let result = await poolQuery(sql);
        console.log("Number of records deleted: " + result.affectedRows);
    } catch (err) {
        console.error("Error in DeleteAll function:", err);
        throw err;
    }
}

module.exports = {
    Show: Show,
    Store: Store,
    Delete: Delete,
    DeleteAll: DeleteAll
};