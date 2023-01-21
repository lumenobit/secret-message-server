require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// Note: If the file name is index.js we dont need to mention the file name.
// Instead of ./api/index, we can write ./api
const apiRouter = require('./src/api');

const server = express();
const port = 4000 || process.env.PORT;

server.use(cors());

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/api', apiRouter);

// __dirname gets the current directory of the file (index.js in this case).
// server.use('/', express.static(path.join(__dirname, 'src/public')));

server.listen(port, () => {
    console.log(`Server listening to port ${port}`);
})


// localhost:4000/api/user

// localhost:4000/api/message
// POST, GET, DELETE

// secretmessage.com/anirban

// 8UnUqFhoG8tYpsAJ