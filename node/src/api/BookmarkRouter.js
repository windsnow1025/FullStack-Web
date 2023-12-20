const express = require('express');
const router = express.Router();
const BookmarkDAO = require("../db/BookmarkDAO");
const jwt = require('jsonwebtoken');


router.get('/', async (req, res, next) => {
    try {
        const bookmarks = await BookmarkDAO.SelectAll();
        res.status(200).json(bookmarks);
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
        next(err);
    }
});

const rootUser = "windsnow1025@gmail.com";

router.use(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const username = await jwt.verify(token, process.env.JWT_SECRET).sub;
        if (username != rootUser) {
            return res.sendStatus(403);
        }
        next();
    } catch (err) {
        res.sendStatus(403);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const bookmark = req.body.data;
        await BookmarkDAO.Insert(bookmark);
        res.status(201).send(true);
    } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send("Error occurred while storing data.");
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const bookmark = req.body.data;
        await BookmarkDAO.Update(id, bookmark);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in PUT /:id:", err);
        res.status(500).send("Error occurred while updating data.");
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await BookmarkDAO.Delete(id);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        res.status(500).send("Error occurred while deleting data.");
    }
});

module.exports = router;