const express = require('express');
const http = require("http");
const bodyParser = require('body-parser');

const app = express();

const userAPI = require('./user-api');
const messageAPI = require('./message-api');
const authAPI = require('./auth-api');


// HTTP
const port = 3000;
http.createServer(app.listen(port, () => {
    console.log(`Server listening at port ${port}...`);
}));


// Serve Static Files
app.use(express.static('public'));
app.use(express.static('dist'));


// support parsing of application/json type post data
app.use(bodyParser.json());

// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));


// Router
app.use('/api/user-api', userAPI);
app.use('/api/message-api', messageAPI);
app.use('/api/auth-api', authAPI);