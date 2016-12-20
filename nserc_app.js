var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var spawn = require("child_process").spawn;
var fs = require("fs");
var mkdirp = require('mkdirp');

var userCount = 0;
var session = require("express-session")({
	secret: "my-secret",
	resave: true,
	saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

io.use(sharedsession(session, {
	autoSave: true
}));

function decodeBase64Image(dataString) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var response = {};

	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}

	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');

	return response;
}

app.use(express.static("./"));
app.get('./', function(req, res) {
	res.sendFile('index.html', {
		root: __dirname
	});
});

io.on('connection', function(socket) {
	var jarFile;
	var StringDecoder = require("string_decoder").StringDecoder;
	var decoder = new StringDecoder("utf8");
	var cameras = {};

	socket.newData = {};
	socket.emit('news', {
		hello: 'world'
	});
	socket.on("testing",function(data) {
		console.log("testing message: "+data.hello);
	});

	socket.on("saveFrame",function(data) {
		var camPath = "./CAMERA-"+data.cam+"/";
		var frameName = data.time;
		var fileName = frameName + ".jpg";
		try {
			var imageBuffer = decodeBase64Image(data.frame);
			mkdirp(camPath, function(err) {
				if (err) console.error(err)
				else console.log('Done!')
			});
			fs.writeFile(camPath+fileName, imageBuffer.data,
				function() {
					console.log('DEBUG - feed:message: Saved to disk image attached by user:', camPath+fileName);
				});
		} catch (error) {
			console.log("SAVING FRAME ERROR: " + error);
		}
	});
	socket.on("camera1", function(data) {
		socket.newData = "hello";
		cameras[data.camera.cameraNum] = {};
		cameras[data.camera.cameraNum]["x"] = data.camera.cameraX;
		cameras[data.camera.cameraNum]["y"] = data.camera.cameraY;
		console.log("cameras[" + data.camera.cameraNum + "]: " + cameras[data.camera.cameraNum]["x"] + "," + cameras[data.camera.cameraNum]["y"]);
		console.log("socket.newData: " + socket.newData);
	});
	socket.on("start jar", function(data) {
		console.log(data.jar);
		console.log(data.frame);
		console.log("start socket.newData: " + socket.newData);
		try {
			var imageBuffer = decodeBase64Image(data.frame);
			mkdirp('./image', function(err) {
				if (err) console.error(err)
				else console.log('Done!')
			});
			fs.writeFile("./image/test1.jpg", imageBuffer.data,
				function() {
					console.log('DEBUG - feed:message: Saved to disk image attached by user:', "./image/test1.jpg");
				});
		} catch (error) {
			console.log("ERROR: " + error);
		}


		jarFile = spawn("java", ["-jar", data.jar]);
		jarFile.stdout.on("data", function(data) {
			var message = decoder.write(data);
			console.log(message.trim());
		});
	});
	socket.on("stop jar", function(data) {
		console.log(data.command);
		console.log("stop socket.newData: " + socket.newData);
		jarFile.stdin.write(data.command + "\n");
		//		jarFile.stdout.pipe(process.stdout);	
	});
});

server.listen(8554, function() {
	console.log('listening on *:8554');
});
