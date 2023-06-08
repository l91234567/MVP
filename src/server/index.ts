const routes = require('../database/controllers/dng.js')
const path = require('path');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const socket = require('socket.io');
const io = socket(server, {cors: {origin:"*"}});


app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('/topic/:topic', (req:any, res:any) => {

  routes.getTopic(req, res);
})
app.get('/topics', (req:any, res:any) => {

  routes.getTopics(req, res);
})
app.post('/topic', (req:any, res:any) => {

  routes.postTopic(req, res);
})

const port = 3002;
server.listen(port, () => console.log(`server is running on port ${port}`));




var connections:any = {};
var notPlayedUsers:any = [];
var host:string = "";
var currentPlayerId ='';
var targetWord = '';
var users:any = {};
var currentTopicWords:any;
io.on('connection', (socket:any) => {

  io.to(socket.id).emit('id', socket.id)

  if (host === "") {
    host = socket.id;
  }


  io.to(socket.id).emit('host', host);

  connections[socket.id] = socket.id;

  socket.on('currentTopic', (data:any)=> {
    io.emit('currentTopic', data)
  })

  socket.on('topicWords', (data:[string]) => {
    if (socket.id === host){
      currentTopicWords = data;
      var index = Math.floor(Math.random() * data.length);
      targetWord = currentTopicWords[index]
      io.emit('targetWord', currentTopicWords[index]);
      currentTopicWords.splice(index, 1)
    }


  })

  socket.on('changeWord', (data:string) => {
    if(currentTopicWords.length === 0) {
      io.emit('gameOver', users)
      return;
    }
      var index = Math.floor(Math.random() * currentTopicWords.length);


      if(data === socket.id) {
        users[currentPlayerId].points += 2;
        users[socket.id].points += 1;

        currentTopicWords.splice(index, 1)
        currentPlayerId = data;
        let info = {
          currentPlayerId:currentPlayerId,
          targetWord:currentTopicWords[index]
        }
        io.emit('currentRound',info)
        io.emit('currentPlayerId', currentPlayerId);
        io.emit('targetWord', currentTopicWords[index]);
      }



  })

  socket.on('gameStart', (data:any) => {
    notPlayedUsers = Object.keys(connections)

    currentPlayerId = notPlayedUsers[0];
    for(var i of notPlayedUsers) {
      users[i] = {}
      users[i].points = 0;
    }

    io.emit('currentPlayerId', currentPlayerId);
    let info = {
      currentPlayerId:currentPlayerId,
      targetWord:targetWord
    }
    io.emit('currentRound',info)
  })


  io.emit('newConnect', {
    id:socket.id,
    connections: connections
  })



  socket.on('drawing', (data:any) => {
    socket.broadcast.emit('drawing', data)
  });

  socket.on('stopDrawing', (data:any)=> {
    socket.broadcast.emit('stopDrawing', data)
  })

  socket.on('message', (data:any)=> {

    io.emit('message', data)
  })


  socket.on('disconnect', function() {

    if (socket.id === host) {
      delete connections[socket.id];
      delete users[socket.id]
      host = '';
      for (var i in connections) {
          host = i;
          break;
      }


      io.emit('host', host);
    } else {
      delete connections[socket.id];
    }



    io.emit('disconnection', {
      id:socket.id,
      connections: connections
    })
 });


})

