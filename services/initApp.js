
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors')


// express init
const app = express();

var corsOptions = {
    origin: '*',
}
app.use(cors(corsOptions));
app.use(express.static('public'))
const server = http.createServer(app);
const io = new Server(server);

module.exports={
    server,
    io,
    app
}