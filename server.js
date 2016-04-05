var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();
var rooms = {};
app.set('PORT',3000);
var server = app.listen(app.get('PORT'),function(err){
  if(err){
    console.error('server error:%s',err && ess.message);
    return;
  }
  console.log('server listening at :::',app.get('PORT'));
});

var io = require('socket.io')(server);
var gSocket;
io.sockets.on('connection', function (socket) {
  gSocket = socket;
  socket.on('online', function (data) {
    socket.name = data.user;
    var curRoomId = data.curRoomId;
    var user = data.user;
    if(!rooms[curRoomId]){
      rooms[curRoomId] = {};
      rooms[curRoomId][user] = user;
      io.sockets.emit('online', {users: rooms[curRoomId], user:user,curRoomId:curRoomId});
    }else{
      if(!rooms[curRoomId][user]){
        rooms[curRoomId][user] = user;
        io.sockets.emit('online', {users: rooms[curRoomId], user:user,curRoomId:curRoomId});
      }
    }
  });
  socket.on('say',function(data){
    var toObj = data.toObj;
    //console.log(data);
    if(toObj == 'all'){
      socket.broadcast.emit('say', data);
    }else{
      var clients = io.sockets.clients();
      clients.forEach(function (client) {
        if (client.name == data.to) {
          client.emit('say', data);
        }
      });
    }
  });
  socket.on('offline',function(data){
    if(rooms[data.curRoomId]){
      delete rooms[data.curRoomId][data.user];
      socket.broadcast.emit('offline',{user:data.user,curRoomId:data.curRoomId});
    }
  });
  socket.on('disconnect',function(){
    var user = socket.name;
    for(var room in rooms){
      if(rooms[room][user]){
        delete rooms[room][user];
        socket.broadcast.emit('offline', {user: socket.name,curRoomId:room});
      }
    }
  });
});

app.use(session({
  secret:'recommand 128 bytes random string',
  cookie:{maxAge:60*1000*1000}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extened:true}));

app.use('/public',express.static(path.join(__dirname,'/public')));
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

app.engine('html',require('ejs').renderFile);

app.use('/login',loginRouter);
//app.use('/logout',logoutRouter);
app.use('/',indexRouter);
app.use('/user',userRouter);
app.get('/room/users/:roomId',function(req,res,next){
  res.json(rooms[req.params.roomId]);
});
app.get('/logout',function(req,res,next){
  if(req.session.userid){
    var user = req.session.userid;
    if(gSocket){
      for(var room in rooms){
        if(rooms[room][user]){
          delete rooms[room][user];
          gSocket.broadcast.emit('offline', {user: user,curRoomId:room});
        }
      }
    }
    delete req.session.userid;
  }
  res.redirect('/login');
});
