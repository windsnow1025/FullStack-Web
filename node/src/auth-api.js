const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

router.post('/', async (req, res, next) => {
    try {
        let token = req.body.token;
        try {
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            let username = decoded.username;
            res.status(200).send(username);
            next();
        } catch (err) {
            console.error(err);
            res.status(401).send("Invalid Token");
            next();
        }
    } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send("Error occurred while fetching data.");
        next(err);
    }
});

module.exports = router;