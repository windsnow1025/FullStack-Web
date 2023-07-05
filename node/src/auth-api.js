const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

router.post('/', async (req, res, next) => {
    try {
        let token = req.body.token;
        console.log(req.body);
        try {
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            let username = decoded.username;
            res.send(username);
            next();
        } catch (err) {
            console.error(err);
            res.send(false);
            next();
        }
    } catch (err) {
        console.error("Error in POST /:", err);
        next(err);
    }
});

module.exports = router;