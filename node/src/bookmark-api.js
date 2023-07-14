const express = require('express');
const router = express.Router();
const BookmarkSQL = require("./bookmark-sql");
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;

            console.log(req.user.username);

            if (req.user.username != "windsnow1025@gmail.com") {
                return res.sendStatus(403);
            }

            next();
        });
    } else {
        res.sendStatus(401);
    }
});

router.get('/', async (req, res, next) => {
    try {
        let bookmarks = await BookmarkSQL.Show();
        res.json(bookmarks);
    } catch (err) {
        console.error("Error in GET /:", err);
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let { firstTitle, secondTitle, url, comment } = req.body;
        await BookmarkSQL.Store(firstTitle, secondTitle, url, comment);
        res.send(true);
    } catch (err) {
        console.error("Error in POST /:", err);
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { firstTitle, secondTitle, url, comment } = req.body;
        await BookmarkSQL.Update(id, firstTitle, secondTitle, url, comment);
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