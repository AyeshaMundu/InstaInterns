var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
server.listen(8080,"127.0.0.1");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit:'5mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/visitor',routes);
app.use('/login',routes);
app.use('/rest',routes);
app.use('/users', users);
app.use('/agent',routes);
app.use('/log_out',routes);
app.use('/agent_pick',routes)
app.use('/offline',routes);
app.use('/online',routes);

app.io=require('socket.io')();
agents={};
visitors={};
pair=[];

io.sockets.on('connection',function(socket){

  console.log("socket connected");

  socket.on('new_visitor',function(data){
    console.log("undertaker");
    console.log("in socket catch "+data.v1+" and "+data.v2);
    var a=data.v1;
    var b=data.v2;
    var c=data.v3;
    socket.nickname=data.v2;
    visitors[socket.nickname]=socket;
    console.log(" new visitor is "+socket.nickname);
    pair.push(data);
    io.sockets.emit('catchit',a,b);
  });

  socket.on('check',function(data){
    console.log(data);
    console.log("check successful");
  });

  socket.on('visitor_disconnect1',function(data,data1){
    console.log("insode hkhbdjfdj");
    console.log(data);
    console.log(data1);
    delete visitors[data1];
    io.sockets.emit('visitor_disconnect',data,data1);
  });

  socket.on('disconnect',function(data){
    console.log("this is data "+data);
    console.log("its ok");
    if(agents[socket.nickname]){
      console.log(socket.nickname+" has disconnected");
      for(var i=0;i<pair.length;i++){
        console.log("inside visitor disconnect");
        console.log(pair[i]);
        if(pair[i].v1===socket.nickname){
          io.sockets.emit('agent_disconnect',pair[i].v1,pair[i].v2);
          break;
        }
      }
      delete agents[socket.nickname];
    }
    else if(visitors[socket.nickname]){
      console.log("this is array wala loop");
      console.log("nickname is "+socket.nickname);
      console.log(pair.length);
      for(var i=0;i<pair.length;i++){
        console.log("inside visitor disconnect");
        console.log(pair[i]);
        if(pair[i].v2===socket.nickname){
          io.sockets.emit('visitor_disconnect',pair[i].v1,pair[i].v2);
          break;
        }
      }
      console.log(socket.nickname+" has disconnected");
      delete visitors[socket.nickname];
    }
  });

  socket.on('new_user',function(data){
    console.log("inside new user"+data);
    socket.nickname=data;
    agents[socket.nickname]=socket;
    console.log(" new user is "+socket.nickname);
  });

  socket.on('vmsg',function(data,data1,data2){
    console.log("visitor message");
    console.log(data);
    console.log(data1);
    console.log(data2);
    console.log("vis");
    console.log("hehehehiahah");
    agents[data1].emit('s_to_ag',data,data1,data2);
  });

  socket.on('vtyping',function(data1,data2){
    console.log("typing wala msg");
    console.log(data1);
    console.log(data2);
    console.log("hehehehiahah");
    agents[data1].emit('typing_to_ag',data1,data2);

  });

  socket.on('atyping',function(data,data1){
    console.log("typing wala agent message");
    console.log(data);
    console.log(data1);
    for(var i=0;i<pair.length;i++){
      console.log("inside here");
      console.log(pair[i]);
      if(data1===pair[i].v2){
        console.log("hehehehiahah");
        visitors[data1].emit('typing_to_v',data,data1);
        break;

      }
    }
  });

  socket.on('profile',function(data,data1){
    if(data in agents){
      console.log("emitted profile");
      setTimeout(function(){
        io.sockets.emit('details',data,data1);
      },1000);
      console.log("ok....");
    }
  });

  socket.on('loggingout',function(data){
    console.log("logging out"+data);
    io.sockets.emit('removeagent',data);
  })

  socket.on('loggingin',function(data){
    console.log("logging in"+data);
    io.sockets.emit('addagent',data);
  })

  socket.on('picked',function(data)
  {
    console.log("here in pick "+data);
    console.log(visitors[data]);
    visitors[data].emit('arc_clk',data);
  });

  socket.on('amsg',function(data,data1){
    console.log("agent message");
    console.log(data);
    console.log(data1);
    for(var i=0;i<pair.length;i++){
      console.log("inside here");
      console.log(pair[i]);
      if(data1===pair[i].v2){
        console.log("hehehehiahah");
        visitors[data1].emit('ag_to_s',data,data1);
        break;
      }
    }
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
