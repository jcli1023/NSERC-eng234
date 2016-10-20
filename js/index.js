/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 */
var MAX_CAMERAS = 4;
var MAX_VID_SIZE_TEMP1_HEIGHT = 720;
var MAX_VID_SIZE_TEMP1_WIDTH = 1280;
var MAX_VID_SIZE_TEMP2_HEIGHT = 300;
var MAX_VID_SIZE_TEMP2_WIDTH = 400;
var zFRONT = 1000;
var zBACK = 500;
var currentNumCams = 1;

/*var myPapers = [];

myPapers[0] = new paper.PaperScope();
myPapers[1] = new paper.PaperScope();*/
//pipe1 = new createPipeline1();

/*var mypapers = [];
mypapers[0] = new paper.PaperScope();
mypapers[1] = new paper.PaperScope();

mypapers[0].setup($("#canvas1")[0]);


paper = mypapers[0];
var circle1 = new paper.Path.Circle(30, 30, 20);
circle1.style = {
    fillColor: new paper.Color(0, 0, 1),
    strokeColor: "black"
};
*/


//mypapers[0].view.draw();

/*window.onload = function() {
var mypapers = [];
mypapers[0] = new paper.PaperScope();
mypapers[1] = new paper.PaperScope();

mypapers[0].setup("objectCam1");


paper = mypapers[0];
var circle1 = new paper.Path.Circle(30, 30, 20);
circle1.style = {
    fillColor: new paper.Color(0, 0, 1),
    strokeColor: "red"
};

mypapers[1].setup("borderCam1");
paper = mypapers[1];
var circle1 = new paper.Path.Circle(100, 100, 20);
circle1.style = {
    fillColor: new paper.Color(1, 0, 0),
    strokeColor: "yellow"
};


mypapers[0].view.draw();
mypapers[1].view.draw();
}
*/

//paper.install(pipe1);
/*paper.install(window)
window.onload = function() {
	// Setup directly from canvas id:
	paper.setup('objectCam1');
	/*var path1 = new Path();
	path1.strokeColor = 'green';
	var start = new Point(100, 100);
	path1.moveTo(start);
	path1.lineTo(start.add([ 200, -50 ]));*/
//	paper.setup('borderCam1');
/*
	var path6 = new Path();
	path6.strokeColor = 'blue';
	var start = new Point(200, 200);
	path6.moveTo(start);
	path6.lineTo(start.add([ 200, -50 ]));
	view.draw();*/
//}


//Template 1
function setTemplate1() {
	document.getElementById("test").innerHTML = "Template1";
	document.getElementById("template2").style.display = "none";
	document.getElementById("videoOutput1").width = MAX_VID_SIZE_TEMP1_WIDTH;
	document.getElementById("videoOutput1").height = MAX_VID_SIZE_TEMP1_HEIGHT;
	document.getElementById("objectCam1").width = MAX_VID_SIZE_TEMP1_WIDTH;
	document.getElementById("objectCam1").height = MAX_VID_SIZE_TEMP1_HEIGHT;
	document.getElementById("borderCam1").width = MAX_VID_SIZE_TEMP1_WIDTH;
	document.getElementById("borderCam1").height = MAX_VID_SIZE_TEMP1_HEIGHT;
	//document.getElementById("template1").style.display = "inline";
	if (currentNumCams > 1) {
		currentNumCams = 1;
	}
	document.getElementById("test2").innerHTML = currentNumCams;

	overlayTextCanvas();
}

//Template 2
function setTemplate2() {
	document.getElementById("test").innerHTML = "Template2";
	document.getElementById("videoOutput1").width = MAX_VID_SIZE_TEMP2_WIDTH;
	document.getElementById("videoOutput1").height = MAX_VID_SIZE_TEMP2_HEIGHT;
	document.getElementById("objectCam1").width = MAX_VID_SIZE_TEMP2_WIDTH;
	document.getElementById("objectCam1").height = MAX_VID_SIZE_TEMP2_HEIGHT;
	document.getElementById("borderCam1").width = MAX_VID_SIZE_TEMP2_WIDTH;
	document.getElementById("borderCam1").height = MAX_VID_SIZE_TEMP2_HEIGHT;
	//document.getElementById("template1").style.display = "none";
	document.getElementById("template2").style.display = "inline";
	currentNumCams = 2;
	document.getElementById("test2").innerHTML = currentNumCams;

	overlayTextCanvas();
	createPipeline2();
}

function overlayTextCanvas() {
	for (i = 1; i <= currentNumCams; i++) {
		var canvas1 = document.getElementById("objectCam" + i);
		var context1 = canvas1.getContext("2d");
		var canvas2 = document.getElementById("borderCam" + i);
		var context2 = canvas2.getContext("2d");
		context1.fillStyle = "green";
		context1.font = "bold 16px Arial";
		context1.fillText("ObjectCam" + i, 100, 100);


		context2.fillStyle = "blue";
		context2.font = "bold 16px Arial";
		context2.fillText("borderCam" + i, 200, 200);
	}
}

function clearCanvas(canvasId) {
	document.getElementById(canvasId).width = document.getElementById(canvasId);
}


function getopts(args, opts) {
	var result = opts.default || {};
	args.replace(
		new RegExp("([^?=&]+)(=([^&]*))?", "g"),
		function($0, $1, $2, $3) {
			result[$1] = $3;
		});

	return result;
};

var args = getopts(location.search, {
	default: {
		ws_uri: 'ws://' + location.hostname + ':8888/kurento',
		ice_servers: undefined
	}
});

if (args.ice_servers) {
	console.log("Use ICE servers: " + args.ice_servers);
	kurentoUtils.WebRtcPeer.prototype.server.iceServers = JSON.parse(args.ice_servers);
} else {
	console.log("Use freeice")
}

window.addEventListener('load', createPipeline1);
window.addEventListener('load', overlayTextCanvas);
//window.addEventListener('load',function(){pipe1();});
//window.addEventListener('load',pipe1());

/*window.addEventListener('load', function(){
  console = new Console('console', console);
	var videoOutput = document.getElementById('videoOutput');
	var address = document.getElementById('address');
	//address.value = 'http://files.kurento.org/video/puerta-del-sol.ts';
	address.value='rtsp://192.168.41.128:8554/jellyfish-3-mbps-hd-h264.mkv';
  var pipeline;
  var webRtcPeer;

  startButton = document.getElementById('start');
  startButton.addEventListener('click', start);

  stopButton = document.getElementById('stop');
  stopButton.addEventListener('click', stop);

  function start() {
  	if(!address.value){
  	  window.alert("You must set the video source URL first");
  	  return;
  	}
  	address.disabled = true;
  	showSpinner(videoOutput);
    var options = {
      remoteVideo : videoOutput
    };
    webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
      function(error){
        if(error){
          return console.error(error);
        }
        webRtcPeer.generateOffer(onOffer);
        webRtcPeer.peerConnection.addEventListener('iceconnectionstatechange', function(event){
          if(webRtcPeer && webRtcPeer.peerConnection){
            console.log("oniceconnectionstatechange -> " + webRtcPeer.peerConnection.iceConnectionState);
            console.log('icegatheringstate -> ' + webRtcPeer.peerConnection.iceGatheringState);
          }
        });
    });
  }

  function onOffer(error, sdpOffer){
    if(error) return onError(error);

  	kurentoClient(args.ws_uri, function(error, kurentoClient) {
  		if(error) return onError(error);

  		kurentoClient.create("MediaPipeline", function(error, p) {
  			if(error) return onError(error);

  			pipeline = p;

  			pipeline.create("PlayerEndpoint", {uri: address.value}, function(error, player){
  			  if(error) return onError(error);

  			  pipeline.create("WebRtcEndpoint", function(error, webRtcEndpoint){
  				if(error) return onError(error);

          setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer, onError);

  				webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer){
  					if(error) return onError(error);

            webRtcEndpoint.gatherCandidates(onError);

  					webRtcPeer.processAnswer(sdpAnswer);
  				});

  				player.connect(webRtcEndpoint, function(error){
  					if(error) return onError(error);

  					console.log("PlayerEndpoint-->WebRtcEndpoint connection established");

  					player.play(function(error){
  					  if(error) return onError(error);

  					  console.log("Player playing ...");
  					});
  				});
  			});
  			});
  		});
  	});
  }

  function stop() {
    address.disabled = false;
    if (webRtcPeer) {
      webRtcPeer.dispose();
      webRtcPeer = null;
    }
    if(pipeline){
      pipeline.release();
      pipeline = null;
    }
    hideSpinner(videoOutput);
  }

});
*/
function alertEnd() {
	v = document.getElementById('videoOutput1');
	console.log("HELLO ALERT ENDED?");
	pipe1.stop();
}

//window.pipe1 = function createPipeline1 () {
function createPipeline1() {

	var paperScopes = [];
	paperScopes[0] = new paper.PaperScope();
	paperScopes[1] = new paper.PaperScope();

	paperScopes[0].setup("objectCam1");
	paperScopes[1].setup("borderCam1");


	/*
	paperScopes[0].view.autoUpdate = false;
	paperScopes[1].view.autoUpdate = false;

	paper = paperScopes[0];


	var circle1 = new paper.Path.Circle(30, 30, 20);
	circle1.style = {
	    fillColor: new paper.Color(1, .5, .5),
	    strokeColor: "black"
	};


	paper = paperScopes[1];

	var circle2 = new paper.Path.Circle(60, 60, 20);
	circle2.style = {
	    fillColor: new paper.Color(.5, .5, 1),
	    strokeColor: "black"
	};

	paperScopes[0].view.draw();
	paperScopes[1].view.draw();
	*/
	//var pipe1 = function createPipeline1(){
	console = new Console('console1', console);
	var videoOutput = document.getElementById('videoOutput1');
	var address = document.getElementById('address1');
	address.value = 'rtsp://192.168.41.128:8554/jellyfish-3-mbps-hd-h264.mkv';
	var pipeline;
	var webRtcPeer;

	var camNum = 1;
	var frameDim = [1920,1080]; //dimensions of the frames
	var vidDim = [MAX_VID_SIZE_TEMP1_WIDTH, MAX_VID_SIZE_TEMP1_HEIGHT]; //dimensions of the video
	var timeFrame //year month date hours minutes seconds milliseconds
	var drawTimer = null;
	var currentPathObject;
	var currentPathBorder;
	var isPaused = false;
	var source; //eventSource for serve sided events
	var objectPresent = null;


	var dumbCount = 0;
	startButton = document.getElementById('start1');
	startButton.addEventListener('click', start);

	stopButton = document.getElementById('stop1');
	stopButton.addEventListener('click', stop);

	document.getElementById("objectButton").addEventListener("click", drawObject);
	document.getElementById("borderButton").addEventListener("click", drawBorder);


	/*	  videoOutput.addEventListener("ended",function(){
		alert("video ended!");
		stopScreenshot(1);
	  	});
	*/
	videoOutput.addEventListener("pause", function() {
		stopScreenshot(camNum);
	});
	videoOutput.addEventListener("playing", function() {
		startScreenshot(camNum);
	});



	function stopScreenshot(camNum) {
		if (drawTimer) {
			clearInterval(drawTimer);
			drawTimer = null;
			firstTimeImage = true;
		}
	}

	function startScreenshot(camNum) {
		if (drawTimer == null) {
			drawTimer = setInterval(function() {
				grabScreenshot(camNum)
			}, 500);
		}
	}

	function grabScreenshot(camNum) {
		dumbCount++;
		console.log("HELLO IM IN HERE SCREENSHOT" + dumbCount);
		var destinationContext;
		var remoteVideoCanvas;
		var saveToServerFrame;
		remoteVideoCanvas = webRtcPeer.currentFrame;
		/*destinationCanvas = document.getElementById("testCanvas");
	destinationContext = destinationCanvas.getContext("2d");
	//destinationContext.clearRect(0,0,destinationCanvas.width,destinationCanvas.height);
	
	destinationCanvas.height = remoteVideoCanvas.height;
	destinationCanvas.width = remoteVideoCanvas.width;

	destinationContext.drawImage(remoteVideoCanvas,0,0);
*/
		saveFrameToServer(remoteVideoCanvas, camNum);

	}

	function saveFrameToServer(saveCurrentFrame, camNum) {
		var saveToServerFrame;
		var dateFrame = new Date();
		timeFrame = dateFrame.getFullYear() + dateFrame.getMonth() + dateFrame.getDate() + "_" + dateFrame.getHours() + dateFrame.getMinutes() + dateFrame.getSeconds() + dateFrame.getMilliseconds();
		saveToServerFrame = saveCurrentFrame.toDataURL("image/jpeg", 0.5);
		//saveToServerFrame = saveCurrentFrame.toDataURL();
		frameDim = [saveCurrentFrame.width, saveCurrentFrame.height];
		vidDim = [videoOutput.width, videoOutput.height];

		$.post("saveScreenshot.php", {
				cam: camNum,
				time: timeFrame,
				frame: saveToServerFrame,
				frameDim: frameDim,
				vidDim: vidDim
			},
			function(data, status) {

				document.getElementById("test3").innerHTML = data + " " + status + " " + dumbCount;
				//alert("Data: " + data + "\nStatus: " + status);
			});
	}

	function drawObject() {
		//Brings objectCam1 canvas to front for mouse events, borderCam1 canvas to back
		document.getElementById("objectCam1").style.zIndex = zFRONT;
		document.getElementById("borderCam1").style.zIndex = zBACK;
		console.log("entered drawObject()");
		if (!isPaused) {
			console.log("!isPaused### videoOutput.paused: " + videoOutput.paused);
			isPaused = true;
			if (!videoOutput.paused) {

				console.log("Entered here");
				videoOutput.pause();

			}
			document.getElementById("objectButton").innerHTML = "Drawn Object of Interest";
			document.getElementById("borderButton").disabled = true;
			//objectCam1 = document.getElementById("objectCam1");

			paper = paperScopes[0];

			function onMouseDown(event) {
				currentPathObject = new paper.Path();
				currentPathObject.strokeColor = 'green';
				currentPathObject.add(event.point);
			}

			objectTrackTool1 = new paper.Tool();
			objectTrackTool1.onMouseDown = onMouseDown;


			objectTrackTool1.onMouseDrag = function(event) {
				currentPathObject.add(event.point);
			}


		} else if (isPaused) {
			isPaused = false;
			console.log("isPaused##### videoOutput.paused2: " + videoOutput.paused);
			if (videoOutput.paused)
				videoOutput.play();

			document.getElementById("objectButton").innerHTML = "Tracking Object";
			document.getElementById("borderButton").disabled = false;
			document.getElementById("objectTracker").innerHTML = "Object Tracking";

			objectTrackTool1.remove();

			initializeDrawings(camNum, currentPathObject);

			//When server sends information to client
			if (typeof(EventSource) !== "undefined") {
				console.log("entered EventSource");
				//source = new EventSource("sse_test.php?camNum="+camNum+"&frameX="+frameDim[0]+"&frameY="+frameDim[1]+"&vidX="+vidDim[0]+"&vidY="+vidDim[1]);
				source = new EventSource("sse_test.php?camNum="+camNum);
				source.onmessage = function(event) {
					console.log("event.data: "+event.data + " event.lastEventId: " + event.lastEventId);
					var jsonObj = JSON.parse(event.data);
					var jsonObj2 = [];
					var segArrays = [];
					var strokeColorArray = [];
					var jsonObj3 = {
						"name": "currentPathObject",
						"applyMatrix": true,
						"segments": currentPathObject.segments.toString(),
						"strokeColor": currentPathObject.strokeColor.toString()
					};
					var jsonObj4 = {
						"word": "hello"
					};
					jsonObj2.push("Path");
					jsonObj2.push(jsonObj3);
					jsonObj2.push(jsonObj4);
					console.log("jsonObj2: " + jsonObj2[1].segments + " " + jsonObj2[1].strokeColor);

					//jsonObj[1].segments.length = 0;
					testObj = jsonObj[0] + "," + jsonObj[1].applyMatrix + "," + jsonObj[1].segments + "," + jsonObj[1].strokeColor;
					console.log("testObj: " + testObj);

					currentPathObject.importJSON(jsonObj);
					/*
					var new_tweets = { };

					new_tweets.k = { };

					new_tweets.k.tweet_id = 98745521;
					new_tweets.k.user_id = 54875;

					new_tweets.k.data = { };

					new_tweets.k.data.in_reply_to_screen_name = 'other_user';
					new_tweets.k.data.text = 'tweet text';

					// Will create the JSON string you're looking for.
					var json = JSON.stringify(new_tweets);
					*/
				};
			} else {
				console.log("Sorry, your browser does not support server-sent events...");
			}

			if (typeof currentPathObject !== 'undefined')
				document.getElementById("test3").innerHTML = "currentPathObject: " + currentPathObject.exportJSON({
				asString: true
			});

		}

	}


	function drawBorder() {
		//Brings borderCam1 canvas to front for mouse events, objectCam1 canvas to back
		document.getElementById("objectCam1").style.zIndex = zBACK;
		document.getElementById("borderCam1").style.zIndex = zFRONT;

		if (!isPaused) {
			console.log("!isPaused### videoOutput.paused: " + videoOutput.paused);
			isPaused = true;
			if (!videoOutput.paused) {

				console.log("Entered here");
				videoOutput.pause();

			}

			document.getElementById("borderButton").innerHTML = "Drawn Border";
			document.getElementById("objectButton").disabled = true;

			paper = paperScopes[1];

			function onMouseDown(event) {
				currentPathBorder = new paper.Path();
				currentPathBorder.strokeColor = 'red';
				currentPathBorder.add(event.point);
			}

			borderTrackTool = new paper.Tool();
			borderTrackTool.onMouseDown = onMouseDown;


			borderTrackTool.onMouseDrag = function(event) {
				currentPathBorder.add(event.point);
			}

		} else if (isPaused) {
			isPaused = false;
			console.log("isPaused##### videoOutput.paused2: " + videoOutput.paused);
			if (videoOutput.paused)
				videoOutput.play();

			document.getElementById("borderButton").innerHTML = "Border Set";
			document.getElementById("objectButton").disabled = false;


			borderTrackTool.remove();


		}
	}

	function initializeDrawings(camNum, coordinates) {
		$.post("initialize_drawings.php", {
				cam: camNum,
				coordinates: coordinates.exportJSON(),
				timeFrame: timeFrame,
				frameDim: frameDim,
				vidDim: vidDim
			},
			function(data, status) {

				//alert(data);
				console.log("initialize_drawing data ##########: " + data);
				//alert("Data: " + data + "\nStatus: " + status);
				/*var jsonObj = JSON.parse(data);
				jsonObj[1].segments.length = 0;
				currentPathObject.importJSON(jsonObj);*/
				currentPathObject.importJSON(data);
			});

		console.log("coordinates.exportJSON(): " + coordinates.exportJSON());
	}

	function start() {
		if (!address.value) {
			window.alert("You must set the video source URL first");
			return;
		}
		address.disabled = true;
		showSpinner(videoOutput);
		var options = {
			remoteVideo: videoOutput
		};
		webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
			function(error) {
				if (error) {
					return console.error(error);
				}
				webRtcPeer.generateOffer(onOffer);
				webRtcPeer.peerConnection.addEventListener('iceconnectionstatechange', function(event) {
					if (webRtcPeer && webRtcPeer.peerConnection) {
						console.log("oniceconnectionstatechange -> " + webRtcPeer.peerConnection.iceConnectionState);
						console.log('icegatheringstate -> ' + webRtcPeer.peerConnection.iceGatheringState);

					}
				});
			});



	}

	function onOffer(error, sdpOffer) {
		if (error) return onError(error);

		kurentoClient(args.ws_uri, function(error, kurentoClient) {
			if (error) return onError(error);

			kurentoClient.create("MediaPipeline", function(error, p) {
				if (error) return onError(error);

				pipeline = p;

				pipeline.create("PlayerEndpoint", {
					uri: address.value
				}, function(error, player) {
					if (error) return onError(error);

					pipeline.create("WebRtcEndpoint", function(error, webRtcEndpoint) {
						if (error) return onError(error);

						setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer, onError);

						webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer) {
							if (error) return onError(error);

							webRtcEndpoint.gatherCandidates(onError);

							webRtcPeer.processAnswer(sdpAnswer);
						});


						player.connect(webRtcEndpoint, function(error) {
							if (error) return onError(error);

							console.log("PlayerEndpoint-->WebRtcEndpoint connection established");

							player.play(function(error) {
								if (error) return onError(error);

								console.log("Player playing ...");
							});
						});
					});
				});
			});

		});
	}
	//	this.stop = function() {
	function stop() {
		address.disabled = false;
		if (webRtcPeer) {
			webRtcPeer.dispose();
			webRtcPeer = null;
		}
		if (pipeline) {
			pipeline.release();
			pipeline = null;
		}
		hideSpinner(videoOutput);

		if (typeof currentPathObject !== 'undefined')
			//currentPathObject.removeSegments();
			currentPathObject.remove();
		if (typeof currentPathBorder !== 'undefined')
			//currentPathBorder.removeSegments();
			currentPathBorder.remove();

		document.getElementById("objectButton").innerHTML = "Track Object";
		document.getElementById("borderButton").innerHTML = "Track Border";

		if (typeof source !== 'undefined')
			source.close();
		stopScreenshot(camNum);
		isPaused = false; //Set drawing function back to initial drawing
		console.log("STOPPED FUNCTION()");
		overlayTextCanvas();

		if (typeof pathObject !== 'undefined')
			document.getElementById("test2").innerHTML = "pathObject: " + pathObject.segments.toString();
		if (typeof currentPathObject !== 'undefined')
			document.getElementById("test3").innerHTML = "currentPathObject: " + currentPathObject.segments.toString();
	}

}; //createPipeline1


function createPipeline2() {
	console = new Console('console2', console);
	var videoOutput = document.getElementById('videoOutput2');
	var address = document.getElementById('address2');
	address.value = 'rtsp://192.168.41.128:8554/jellyfish-3-mbps-hd-h264.mkv';
	var pipeline;
	var webRtcPeer;

	var drawTimer = null;

	var dumbCount = 0;
	startButton = document.getElementById('start2');
	startButton.addEventListener('click', start);

	stopButton = document.getElementById('stop2');
	stopButton.addEventListener('click', stop);

	//document.getElementById("pauseButton").addEventListener("click", pauseVideo);
	//document.getElementById("resumeButton").addEventListener("click", resumeVideo);


	/*	  videoOutput.addEventListener("ended",function(){
		alert("video ended!");
		stopScreenshot(1);
	  	});
	*/

	videoOutput.addEventListener("pause", function() {
		stopScreenshot(2);
	});
	videoOutput.addEventListener("playing", function() {
		startScreenshot(2);
	});



	function stopScreenshot(camNum) {
		if (drawTimer) {
			clearInterval(drawTimer);
			drawTimer = null;
			firstTimeImage = true;
		}
	}

	function startScreenshot(camNum) {
		if (drawTimer == null) {
			drawTimer = setInterval(function() {
				grabScreenshot(2)
			}, 50);
		}
	}

	function grabScreenshot(camNum) {
		dumbCount++;
		console.log("HELLO IM IN HERE SCREENSHOT" + dumbCount);
		var destinationContext;
		var remoteVideoCanvas;
		var saveToServerFrame;
		remoteVideoCanvas = webRtcPeer.currentFrame;
		/*destinationCanvas = document.getElementById("testCanvas");
	destinationContext = destinationCanvas.getContext("2d");
	//destinationContext.clearRect(0,0,destinationCanvas.width,destinationCanvas.height);
	
	destinationCanvas.height = remoteVideoCanvas.height;
	destinationCanvas.width = remoteVideoCanvas.width;

	destinationContext.drawImage(remoteVideoCanvas,0,0);
*/
		saveFrameToServer(remoteVideoCanvas, camNum);

	}

	function saveFrameToServer(saveCurrentFrame, camNum) {
		var saveToServerFrame;
		var dateFrame = new Date();
		var timeFrame = dateFrame.getFullYear() + dateFrame.getMonth() + dateFrame.getDate() + "_" + dateFrame.getHours() + dateFrame.getMinutes() + dateFrame.getSeconds() + dateFrame.getMilliseconds();
		saveToServerFrame = saveCurrentFrame.toDataURL("image/jpeg", 0.5);
		//saveToServerFrame = saveCurrentFrame.toDataURL();

		$.post("saveScreenshot.php", {
				cam: camNum,
				time: timeFrame,
				frame: saveToServerFrame,
				frameDim: frameDim,
				vidDim: vidDim
			},
			function(data, status) {

				document.getElementById("test3").innerHTML = data + " " + status + " " + dumbCount;
				//alert("Data: " + data + "\nStatus: " + status);
			});
	}

	function pauseVideo() {
		var destinationContext;
		var remoteVideoCanvas;
		//videoOutput.pause();
		webRtcPeer.remoteVideo.pause();
		remoteVideoCanvas = webRtcPeer.currentFrame;
		document.getElementById("test3").innerHTML = remoteVideoCanvas.width;

		destinationCanvas = document.getElementById("testCanvas");
		destinationCanvas.height = remoteVideoCanvas.height;
		destinationCanvas.width = remoteVideoCanvas.width;
		destinationContext = destinationCanvas.getContext("2d");
		destinationContext.drawImage(remoteVideoCanvas, 0, 0);
	}

	function resumeVideo() {
		//videoOutput.play();  	
		webRtcPeer.remoteVideo.play();
		document.getElementById("test2").innerHTML = "CONTINUE PLAYING ";
	}

	function start() {
		if (!address.value) {
			window.alert("You must set the video source URL first");
			return;
		}
		address.disabled = true;
		showSpinner(videoOutput);
		var options = {
			remoteVideo: videoOutput
		};
		webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
			function(error) {
				if (error) {
					return console.error(error);
				}
				webRtcPeer.generateOffer(onOffer);
				webRtcPeer.peerConnection.addEventListener('iceconnectionstatechange', function(event) {
					if (webRtcPeer && webRtcPeer.peerConnection) {
						console.log("oniceconnectionstatechange -> " + webRtcPeer.peerConnection.iceConnectionState);
						console.log('icegatheringstate -> ' + webRtcPeer.peerConnection.iceGatheringState);

					}
				});
			});



	}

	function onOffer(error, sdpOffer) {
		if (error) return onError(error);

		kurentoClient(args.ws_uri, function(error, kurentoClient) {
			if (error) return onError(error);

			kurentoClient.create("MediaPipeline", function(error, p) {
				if (error) return onError(error);

				pipeline = p;

				pipeline.create("PlayerEndpoint", {
					uri: address.value
				}, function(error, player) {
					if (error) return onError(error);

					pipeline.create("WebRtcEndpoint", function(error, webRtcEndpoint) {
						if (error) return onError(error);

						setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer, onError);

						webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer) {
							if (error) return onError(error);

							webRtcEndpoint.gatherCandidates(onError);

							webRtcPeer.processAnswer(sdpAnswer);
						});


						player.connect(webRtcEndpoint, function(error) {
							if (error) return onError(error);

							console.log("PlayerEndpoint-->WebRtcEndpoint connection established");

							player.play(function(error) {
								if (error) return onError(error);

								console.log("Player playing ...");
							});
						});
					});
				});
			});

		});
	}

	function stop() {
		address.disabled = false;
		if (webRtcPeer) {
			webRtcPeer.dispose();
			webRtcPeer = null;
		}
		if (pipeline) {
			pipeline.release();
			pipeline = null;
		}
		hideSpinner(videoOutput);
		stopScreenshot(2);
	}


}; //createPipeline2

function setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer, onError) {
	webRtcPeer.on('icecandidate', function(candidate) {
		console.log("Local icecandidate " + JSON.stringify(candidate));

		candidate = kurentoClient.register.complexTypes.IceCandidate(candidate);

		webRtcEndpoint.addIceCandidate(candidate, onError);

	});
	webRtcEndpoint.on('OnIceCandidate', function(event) {
		var candidate = event.candidate;

		console.log("Remote icecandidate " + JSON.stringify(candidate));

		webRtcPeer.addIceCandidate(candidate, onError);
	});
}

function onError(error) {
	if (error) {
		console.error(error);
		stop();
	}
}

function showSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].poster = 'img/transparent-1px.png';
		arguments[i].style.background = "center transparent url('img/spinner.gif') no-repeat";
	}
}

function hideSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].src = '';
		arguments[i].poster = 'img/webrtc.png';
		arguments[i].style.background = '';
	}
}

/**
 * Lightbox utility (to display media pipeline image in a modal dialog)
 */
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
	event.preventDefault();
	$(this).ekkoLightbox();
});
