"use strict";
const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server, { cors: { origin: "*" } });
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
const port = 3002;
server.listen(port, () => console.log(`server is running on port ${port}`));
io.on('connection', (socket) => {
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });
    io.to(socket.id).emit('id', socket.id);
    socket.on('stopDrawing', (data) => {
        socket.broadcast.emit('stopDrawing', data);
    });
    socket.on('message', (data) => {
        io.emit('message', data);
    });
});
