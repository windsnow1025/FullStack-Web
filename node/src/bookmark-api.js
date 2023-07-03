const express = require('express');
const router = express.Router();
const BookmarkSQL = require("./bookmark-sql");
const jwt = require('jsonwebtoken');

router.get('/:userId', async (req, res, next) => {
    try {
        let userId = req.params.userId;
        let bookmarks = await BookmarkSQL.Show(userId);
        res.json(bookmarks);
    } catch (err) {
        console.error("Error in GET /:userId:", err);
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let { userId, title, url } = req.body;
        await BookmarkSQL.Store(userId, title, url);
        res.send(true);
    } catch (err) {
        console.error("Error in POST /:", err);
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { title, url } = req.body;
        await BookmarkSQL.Update(id, title, url);
        res.send(true);
    } catch (err) {
        console.error("Error in PUT /:id:", err);
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await BookmarkSQL.Delete(id);
        res.send(true);
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        next(err);
    }
});

module.exports = router;