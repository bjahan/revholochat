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
	
	socket.on('intro', function(name){
		console.log('name: ' + name);
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
		console.log('message: ' + msg);
		//io.emit('chat message', msg);
		
		var offset = {
          	x : 3,
          	y : 2,
			z : 0
        };
			
        var data = {
          externalId : 315531,
          translation : offset
        };
		
		io.emit('transform', JSON.stringify(data));
	});
	
	socket.on('move', function(msg){
		console.log('move: ' + msg);
		//io.emit('chat message', msg);
		io.emit('move', msg);
	});
	
	
	socket.on('status', function(msg){
		console.log('status: ' + msg.name);
		io.emit('status', msg);
	});
	
	socket.on('disconnect', function(){
		console.log('user ' + socket.id + ' disconnected');
	});
})

http.listen(port, function(){
  console.log('listening on *:' + port);
});