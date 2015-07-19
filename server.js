/*Variable*/
  /*Modules*/
var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs');

  /*Variable Globale*/
var users = [];
var messages = [];


/*Port*/
app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/game.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading game.html');
      }
    res.writeHead(200);
    res.end(data);
  });
}

/*Début de la transaction avec les Sockets*/
io.sockets.on('connection', function(socket){
  var me = false;

  /*AllUsr */
  for(var k in users){
    socket.emit('allUsr', users[k]);
  }
  for(var k in messages){
    socket.emit('newMsg', messages[k]);
  }

  /*NewUsr*/
  socket.on('nweUsr', function(user){
    me = user;
    me.id = user.Pseudo+user.Color;
    users[me.id] = me;
    io.sockets.emit('nweUsr', me);
  });

  /*LeaveUsr*/
  socket.on('disconnect', function(){
    if(!me){return false;}
    delete users[me.id];
    io.sockets.emit('leaveUsr', me);
  });

  /*NewMsg*/
  socket.on('newMsg', function(data_msg){
    date = new Date;
    h = date.getHours();
      if(h<10){ h = "0"+h;}
    data_msg.h = h;
    m = date.getMinutes();
      if(m<10){ m = "0"+m; }
    data_msg.m = m;
    data_msg.id = me.id;
    messages.push(data_msg);
    if(messages.length > 20){
      messages.shift();
    }
    io.sockets.emit('newMsg', data_msg);
  });

});