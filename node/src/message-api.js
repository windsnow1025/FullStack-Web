const express = require('express');

const router = express.Router();
const MessageSQL = require("./message-sql");

// Data Processing

router.get('/', async (req, res, next) => {
    try {
        let data = await MessageSQL.Show();
        res.status(200).send(data);
        next();
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
        next(err);
    }
})

router.post('/', async (req, res, next) => {
    try {
        let data = req.body.data;
        await MessageSQL.Store(data);
        res.status(200).send(true);
        next();
    } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send("Error occurred while storing data.");
        next(err);
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await MessageSQL.Delete(id);
        res.status(200).send(true);
        next();
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        res.status(500).send("Error occurred while deleting data.");
        next(err);
    }
})

router.delete('/', async (req, res, next) => {
    try {
        // Delete Data
        await MessageSQL.DeleteAll();
        // Response, Next
        res.send(true);
        next();
    } catch (err) {
        console.error("Error in DELETE /:", err);
        res.status(500).send("Error occurred while deleting all data.");
        next(err);
    }
})

module.exports = router;