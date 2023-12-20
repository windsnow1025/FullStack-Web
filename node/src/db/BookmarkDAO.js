const { poolQuery } = require("./DatabaseConnection");

/**
 * @returns {Promise<Bookmark[]>}
 * @constructor
 */
async function selectAll() {
    const sql = "SELECT * FROM bookmark";
    return await poolQuery(sql);
}

/**
 * @param {Bookmark} bookmark
 */
async function insert(bookmark) {
    const sql = "INSERT INTO bookmark (first_title, second_title, url, comment) VALUES (?,?,?,?)";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark inserted");
}

/**
 * @param {number} id
 * @param {Bookmark} bookmark
 */
async function update(id, bookmark) {
    const sql = "UPDATE bookmark SET first_title = ?, second_title = ?, url = ?, comment = ? WHERE id = ?";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment, id];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark updated");
}

/**
 * @param {number} id
 */
async function deleteByID(id) {
    const sql = "DELETE FROM bookmark WHERE id = ?";
    const sqlParams = [id];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark deleted");
}

module.exports = {
    selectAll: selectAll,
    insert: insert,
    update: update,
    deleteByID: deleteByID
};