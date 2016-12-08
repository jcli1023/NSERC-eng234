
userCount = 0;
var io = require('socket.io').listen(8554);
//var io = require('socket.io').listen(8555);

io.on('connection', function (socket) {
  userCount++
  socket.emit('news', { hello: 'world1' });
	console.log("userCount: "+userCount);
  socket.on('my other event', function (data) {
    console.log(data);
  });
	socket.on("disconnect",function(){userCount--;console.log("userCount: "+userCount);});
});
