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
	var time = {};
	var frameRatio = {};
	var jsonOutput;
	
	socket.on("testing",function(data) {
		console.log("testing message: "+data.hello);
	});

	socket.on("saveFrame",function(data) {
		var camPath = "./CAMERA-"+data.cam+"/";
		var frameName = data.time;
		var fileName = frameName + ".jpg";
		var frameDim = data.frameDim;
		var vidDim = data.vidDim;
		var camIndex = data.cam-1;
		time[camIndex] = data.time;
		
		if (typeof frameRatio[camIndex] !== "undefined")
		{
			frameRatio[camIndex]["x"] = data.frameDim[0]/data.vidDim[0];
			frameRatio[camIndex]["y"] = data.frameDim[1]/data.vidDim[1];
//			console.log("frameRatio: "+frameRatio[data.cam-1]["x"]+"x"+frameRatio[data.cam-1]["y"]);
		}
		else
		{
			frameRatio[camIndex]={};
		}
				 
		try {
			var imageBuffer = decodeBase64Image(data.frame);
			mkdirp(camPath, function(err) {
				if (err) console.error(err)
//				else console.log('Done!')
			});
			fs.writeFile(camPath+fileName, imageBuffer.data,
				function() {
//					console.log('DEBUG - feed:message: Saved to disk image attached by user:', camPath+fileName);
				});
		} catch (error) {
			console.log("SAVING FRAME ERROR: " + error);
		}
	});

	socket.on("initializeDrawings", function(data) {
		var camIndex = data.cam-1;
		console.log("initializeDrawings");
		jarFile = spawn("java", ["-jar", "InitializeObject_old.jar",data.cam,time[camIndex],frameRatio[camIndex]["x"],frameRatio[camIndex]["y"],data.coordinates]);
		jarFile.stdout.on("data", function(data) {
			jsonOutput = data.toString();
			socket.emit("initialCoordinates",{ jsonOutput: jsonOutput });
		});
	});

	socket.on("checkThreshold", function(data) {
		var camIndex = data.cam-1;
		console.log("checkThreshold");
		//console.log("data.cam: "+data.cam+" time["+camIndex+"]: "+time[camIndex]+"frameRatio["+camIndex+"][\"x\"]: "+frameRatio[camIndex]["x"]+" frameRatio["+camIndex+"][\"y\"]: "+frameRatio[camIndex]["y"]+" jsonOutput: "+jsonOutput);
		jarFile = spawn("java", ["-jar", "CheckThreshold_old.jar",data.cam,time[camIndex],frameRatio[camIndex]["x"],frameRatio[camIndex]["y"],jsonOutput]);
		jarFile.stdout.on("data", function(data) {
			jsonOutput = data.toString();
			console.log(jsonOutput);
			socket.emit("thresholdChecked",{ jsonOutput: jsonOutput });
		});
	});

});

server.listen(8554, function() {
	console.log('listening on *:8554');
});
