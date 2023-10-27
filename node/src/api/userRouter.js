const express = require('express');
const router = express.Router();
const UserSQL = require("../sql/userDAO");

const jwt = require('jsonwebtoken');

// Data Processing

router.get('/', async (req, res, next) => {
    try {
        let result = await UserSQL.SelectUsername({
            username: req.query.username
        });
        res.status(200).json(result[0]);
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
    }
});

router.post('/sign-in', async (req, res, next) => {
    try {
        let data = req.body.data;
        let result = await UserSQL.SelectUsernamePassword(data);

        // Judge if data.username and data.password match
        if (result.length > 0) {
            // Generate token
            const token = jwt.sign({sub: data.username}, process.env.JWT_SECRET, {expiresIn: '72h'});
            res.status(200).json({token});
        } else {
            res.status(401).send("Invalid Username or Password");
        }
    } catch (err) {
        console.error("Error in POST /sign-in:", err);
        res.status(500).send("Error occurred while fetching data.");
    }
});

router.post('/sign-up', async (req, res, next) => {
    try {
        let data = req.body.data;
        let sqlData = {username: data.username};

        // Judge if data.username exists
        let result = await UserSQL.SelectUsername(sqlData);
        if (result.length > 0) {
            res.status(401).send("Username already exists");
        } else {
            // Store Data
            await UserSQL.Insert(data);
            res.status(200).send(true);
        }
    } catch (err) {
        console.error("Error in POST /sign-up:", err);
        res.status(500).send("Error occurred while storing data.");
    }
});

router.use((req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;

            next();
        });
    } else {
        res.sendStatus(401);
    }
});

router.put('/', async (req, res, next) => {
    try {
        let data = req.body.data;

        // Get current user data
        let current_user = await UserSQL.SelectUsername({username: req.user.sub});
        let potential_new_user = await UserSQL.SelectUsername({username: data.username});

        // Judge if the username is changed but already exists
        if (data.username != req.user.sub && potential_new_user.length > 0) {
            res.status(409).send("Username already exists");
            next();
        }

        // Update Data
        let updateSqlData = {id: current_user[0].id, username: data.username, password: data.password};
        await UserSQL.Update(updateSqlData);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in PUT /:", err);
        res.status(500).send("Error occurred while updating data.");
    }

});

router.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await UserSQL.Delete(id);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        res.status(500).send("Error occurred while deleting data.");
    }
});

module.exports = router;