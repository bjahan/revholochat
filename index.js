var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var RevitSocket = null;
var HololensSocket = null;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('user ' + socket.id + ' connected');
	
	socket.on('connect', function(name){
		if (name == 'RevitPlugin')
		{
			RevitSocket = socket.id;
		}
		if (name == 'HoloLensApp')
		{
			HololensSocket = socket.id;
		}
	});
	
	socket.on('chat message', function(msg){
		console.log('message:' + msg);
		socket.broadcast.emit('chat message', msg);
	});
	
	socket.on('status', function(msg){
		console.log('status:' + msg);
		socket.broadcast.emit('status', msg);
	});
})

http.listen(port, function(){
  console.log('listening on *:' + port);
});