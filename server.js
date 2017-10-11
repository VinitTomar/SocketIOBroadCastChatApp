var express = require('express');
var http = require('http');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO.listen(server); 

users = [];
connections = [];

server.listen(3000, function(){
  console.log('server started at port 3000');
});

app.get('/',function(req, res){
  res.sendFile(__dirname + "/index.html");
});

io.sockets.on('connection', function(socket){
  //Connect
  connections.push(socket);
  console.log("Connected: %s socket connected",connections.length);
  
  //Disconnect
  socket.on('disconnect',function(data){
    //console.log('data of disconnect'+socket);
    if(socket.username){
      users.splice(users.indexOf(socket.username),1);
      updateUsernames();
    }   
    connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected: %s socket connected",connections.length);
  });  
   
  //Send message
  socket.on('send message',function(data){
    //console.log(data);
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });
  
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });
  
  function updateUsernames(){
    io.sockets.emit('get users', users)
  }
});













