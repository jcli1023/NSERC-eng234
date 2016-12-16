
//userCount = 0;
//var io = require('socket.io').listen(8554);
////var io = require('socket.io').listen(8555);

//io.on('connection', function (socket) {
//  userCount++
//  socket.emit('news', { hello: 'world1' });
//	console.log("userCount: "+userCount);
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//	socket.on("disconnect",function(){userCount--;console.log("userCount: "+userCount);});
//});

var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var spawn = require("child_process").spawn;
var fs = require("fs");
var mkdirp = require('mkdirp');

var userCount = 0;
var sess;

function decodeBase64Image(dataString) 
{
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var response = {};

	if (matches.length !== 3) 
	{
		return new Error('Invalid input string');
 	}

	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');

	return response;
}

//app.use(session);
//app.use(express.static("public"));
app.use(express.static("./"));
app.get('./', function(req, res){
	res.sendFile('index.html',{ root: __dirname });
	sess = req.session;
	console.log("sess1: "+ sess);
});

io.on('connection', function (socket) {
var jarFile;
var StringDecoder = require("string_decoder").StringDecoder;
var decoder = new StringDecoder("utf8");
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on("start jar", function(data)
	{
		console.log(data.jar);
		console.log(data.frame);
		try {		
			var imageBuffer = decodeBase64Image(data.frame);
			mkdirp('./image', function (err) {
				if (err) console.error(err)
				else console.log('Done!')
			});
			fs.writeFile("./image/test1.jpg", imageBuffer.data,  
                        function() 
                        {
                        	console.log('DEBUG - feed:message: Saved to disk image attached by user:', "./image/test1.jpg");
                        });
		}
		catch (error)
		{
			console.log("ERROR: "+ error);
		}
				

		jarFile = spawn("java",["-jar",data.jar]);
		jarFile.stdout.on("data",function(data){ 
			var message = decoder.write(data);
			console.log(message.trim()); 
		});
	});
	socket.on("stop jar", function(data)
	{
		console.log(data.command);
		jarFile.stdin.write(data.command+"\n");
//		jarFile.stdout.pipe(process.stdout);	
	});
});

server.listen(8554, function(){
	console.log('listening on *:8554');
});
