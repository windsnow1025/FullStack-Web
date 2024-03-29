import DatabaseConnection from '../db/DatabaseConnection.js';

/**
 * @param {number} user_id
 * @returns {Promise<Conversation[]>}
 */
async function select(user_id) {
    const sql = "SELECT * FROM conversation WHERE user_id = ?";
    const sqlParams = [user_id];
    return await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
}

/**
 * @param {Conversation} conversation
 */
async function insert(conversation) {
    const sql = "INSERT INTO conversation (user_id, name, conversation) VALUES (?,?,?)";
    const sqlParams = [conversation.user_id, conversation.name, conversation.conversation];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 conversation inserted");
}

/**
 * @param {Conversation} conversation
 */
async function update(conversation) {
    const sql = "UPDATE conversation SET name = ?, conversation = ? WHERE user_id = ? AND id = ?";
    const sqlParams = [conversation.name, conversation.conversation, conversation.user_id, conversation.id];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 conversation updated");
}

/**
 * @param {Conversation} conversation
 */
async function updateName(conversation) {
    const sql = "UPDATE conversation SET name = ? WHERE user_id = ? AND id = ?";
    const sqlParams = [conversation.name, conversation.user_id, conversation.id];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 conversation name updated");
}

/**
 * @param {number} user_id
 * @param {number} id
 */
async function deleteById(user_id, id) {
    const sql = "DELETE FROM conversation WHERE user_id = ? AND id = ?";
    const sqlParams = [user_id, id];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 conversation deleted");
}

export default {
    select,
    insert,
    update,
    updateName,
    deleteById
}