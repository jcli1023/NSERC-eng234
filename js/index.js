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
var MAX_CAMERAS = 2;
var MAX_VID_SIZE_TEMP1_HEIGHT = 400;
var MAX_VID_SIZE_TEMP1_WIDTH = 640;
var MAX_VID_SIZE_TEMP2_HEIGHT = 300;
var MAX_VID_SIZE_TEMP2_WIDTH = 400;
var zFRONT = 1000;
var zBACK = 500;
var currentNumCams = 1;
var pipelines = [];

//Template 1
function setTemplate1() {
	if (currentNumCams > 1) {
		document.getElementById("test").innerHTML = "Template1";
		document.getElementById("template2").style.display = "none";
		document.getElementById("videoOutput1").width = MAX_VID_SIZE_TEMP1_WIDTH;
		document.getElementById("videoOutput1").height = MAX_VID_SIZE_TEMP1_HEIGHT;
		document.getElementById("objectCam1").width = MAX_VID_SIZE_TEMP1_WIDTH;
		document.getElementById("objectCam1").height = MAX_VID_SIZE_TEMP1_HEIGHT;
		document.getElementById("borderCam1").width = MAX_VID_SIZE_TEMP1_WIDTH;
		document.getElementById("borderCam1").height = MAX_VID_SIZE_TEMP1_HEIGHT;
		//document.getElementById("template1").style.display = "inline";
		currentNumCams = 1;
		for (i = currentNumCams; i >= 1; i--)
		{
			pipelines[i].stop();
			pipelines.pop();
		}

	}
//	overlayTextCanvas();
	document.getElementById("test2").innerHTML = currentNumCams;
//	pipeline1.stop();
}

//Template 2
function setTemplate2() {
	if (currentNumCams != 2)
	{
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
		pipelines.push(new createPipeline(currentNumCams));
	}
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

//window.addEventListener("load", function(){ pipeline1 = new createPipeline(currentNumCams);});
window.addEventListener("load", function(){ pipelines.push(new createPipeline(currentNumCams));
email = document.getElementById('email');
email.value = 'testdsmp@dsmp.ryerson.ca';
});
window.addEventListener("load", overlayTextCanvas);

function createPipeline(camNum) {

	var createPipeline = new Object();

	var paperScopes = [];
	paperScopes[0] = new paper.PaperScope();
	paperScopes[1] = new paper.PaperScope();

	objectCam1 = document.getElementById("objectCam"+camNum);
	borderCam1 = document.getElementById("borderCam"+camNum);
	paperScopes[0].setup(objectCam1);
	paperScopes[1].setup(borderCam1);

	//paperScopes[0].setup("objectCam1");
	//paperScopes[1].setup("borderCam1");

	var consoleLog = new Console('console'+camNum, console);

	var videoOutput = document.getElementById('videoOutput'+camNum);
	var address = document.getElementById('address'+camNum);
	address.value = 'rtsp://dsmp.ryerson.ca:8000/test_vid.mkv';
	var pipeline;
	var webRtcPeer;

	var frameDim = [1920, 1080]; //dimensions of the frames
	var vidDim = [MAX_VID_SIZE_TEMP1_WIDTH, MAX_VID_SIZE_TEMP1_HEIGHT]; //dimensions of the video
	var timeFrame //year month date hours minutes seconds milliseconds
	var drawTimer = null;

	var currentPathObject;
	var currentPathBorder;
	var objectTrackTool;
	var borderTrackTool;

	var isPaused = false;
	var source; //eventSource for server sided events

	var dumbCount = 0;
	startButton = document.getElementById('start'+camNum);
	startButton.addEventListener('click', start);

	stopButton = document.getElementById('stop'+camNum);
	stopButton.addEventListener('click', stop);

	clearObjectButton = document.getElementById('clearObjectDrawing'+camNum);
	clearObjectButton.style.display = "none";
	clearObjectButton.addEventListener('click', clearObjectDrawing);

	document.getElementById("objectButton"+camNum).addEventListener("click", drawObject);
	document.getElementById("borderButton"+camNum).addEventListener("click", drawBorder);

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
		}
	}

	function startScreenshot(camNum) {
		if (drawTimer == null) {
			drawTimer = setInterval(function() {
				grabScreenshot(camNum)
			}, 100);
		}
	}

	function grabScreenshot(camNum) {
		dumbCount++;
		//consoleLog.log("HELLO IM IN HERE SCREENSHOT" + dumbCount);
		var destinationContext;
		var remoteVideoCanvas;
		var saveToServerFrame;
		remoteVideoCanvas = webRtcPeer.currentFrame;

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

				document.getElementById("debug"+camNum).innerHTML = data + " " + status + " " + dumbCount;
				//alert("Data: " + data + "\nStatus: " + status);
			});
	}

	function drawObject() {
		//Brings objectCam1 canvas to front for mouse events, borderCam1 canvas to back
		document.getElementById("objectCam"+camNum).style.zIndex = zFRONT;
		document.getElementById("borderCam"+camNum).style.zIndex = zBACK;
		//consoleLog.log("entered drawObject()");
		if (!isPaused) {
			//consoleLog.log("!isPaused### videoOutput.paused: " + videoOutput.paused);

			resetDefaultUI();
			//isPaused must be set after resetDefaultUI()	
			isPaused = true;

			if (!videoOutput.paused) {

				//consoleLog.log("Entered here");
				videoOutput.pause();
				grabScreenshot(camNum);

			}

			document.getElementById("objectButton"+camNum).innerHTML = "Drawn Object of Interest";
			document.getElementById("borderButton"+camNum).disabled = true;
			document.getElementById("clearObjectDrawing"+camNum).style.display = "inline";

			paper = paperScopes[0];

			function onMouseDown(event) {
				currentPathObject = new paper.Path();
				currentPathObject.strokeColor = 'green';
				currentPathObject.add(event.point);
			}

			objectTrackTool = new paper.Tool();
			objectTrackTool.onMouseDown = onMouseDown;


			objectTrackTool.onMouseDrag = function(event) {
				currentPathObject.add(event.point);
			}


		} else if (isPaused) {
			isPaused = false;
			//consoleLog.log("isPaused##### videoOutput.paused2: " + videoOutput.paused);


			document.getElementById("objectButton"+camNum).innerHTML = "Tracking Object";
			document.getElementById("borderButton"+camNum).disabled = false;
			document.getElementById("objectTracker"+camNum).innerHTML = "Object Tracking";
			document.getElementById("clearObjectDrawing"+camNum).style.display = "none";

			objectTrackTool.remove();

			initializeDrawings(camNum, currentPathObject);

			if (videoOutput.paused)
				videoOutput.play();

			//When server sends information to client
			if (typeof(EventSource) !== "undefined") {
				//consoleLog.log("entered EventSource");
				//source = new EventSource("sse_test.php?camNum="+camNum+"&frameX="+frameDim[0]+"&frameY="+frameDim[1]+"&vidX="+vidDim[0]+"&vidY="+vidDim[1]);
				source = new EventSource("sse_test.php?camNum=" + camNum);
				source.onmessage = function(event) {
					//console.log("event.data: "+event.data + " event.lastEventId: " + event.lastEventId);
					var dateFrame = new Date();
					var timeEvent = dateFrame.getMinutes() +"_"+ dateFrame.getSeconds() +"_"+ dateFrame.getMilliseconds();
					//consoleLog.log(camNum+" event "+timeEvent);
					var jsonObj = JSON.parse(event.data);
					currentPathObject.clear();
					currentPathObject.importJSON(jsonObj);

					/*var jsonObj2 = [];
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
*/
					//jsonObj[1].segments.length = 0;
					//testObj = jsonObj[0] + "," + jsonObj[1].applyMatrix + "," + jsonObj[1].segments + "," + jsonObj[1].strokeColor + "," + jsonObj[3].objectFound;
					//console.log("testObj: " + testObj);
					//console.log("typeof jsonObj[3]: " + typeof jsonObj[3].objectFound);

					if (jsonObj[4].objectFound === "false") {
						var reportDateFrame = new Date();
						var reportTimeFrame = reportDateFrame.getFullYear()+"-"+ reportDateFrame.getMonth() +"-"+ reportDateFrame.getDate() + "_" + reportDateFrame.getHours()+":" + reportDateFrame.getMinutes()+":" + reportDateFrame.getSeconds() +":"+ reportDateFrame.getMilliseconds();
						document.getElementById("objectTracker"+camNum).innerHTML = "OBJECT MISSING";
						document.getElementById("objectTracker"+camNum).style.backgroundColor = 'red';
						$.post("email.php", {
							email: email.value,
							time: reportTimeFrame
						},
						function(data, status) {

							//alert(data);
							consoleLog.log("OBJECT MISSING : " + reportTimeFrame);
							consoleLog.log(data);
						});


					} else {
						document.getElementById("objectTracker"+camNum).innerHTML = "OBJECT TRACKED";
						document.getElementById("objectTracker"+camNum).style.backgroundColor = 'green';
					}
					
					trajectory = jsonObj[5].trajectoryCenter;
					consoleLog.log("Trajectory: "+trajectory[0]+","+trajectory[1]);

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
				consoleLog.log("Sorry, your browser does not support server-sent events...");
			}

			if (typeof currentPathObject !== 'undefined')
				document.getElementById("debug"+camNum).innerHTML = "currentPathObject: " + currentPathObject.exportJSON({
					asString: true
				});

		}

	}

	function drawBorder() {
		//Brings borderCam1 canvas to front for mouse events, objectCam1 canvas to back
		document.getElementById("objectCam"+camNum).style.zIndex = zBACK;
		document.getElementById("borderCam"+camNum).style.zIndex = zFRONT;

		if (!isPaused) {
			//consoleLog.log("!isPaused### videoOutput.paused: " + videoOutput.paused);
			isPaused = true;
			if (!videoOutput.paused) {

				//consoleLog.log("Entered here");
				videoOutput.pause();

			}

			document.getElementById("borderButton"+camNum).innerHTML = "Drawn Border";
			document.getElementById("objectButton"+camNum).disabled = true;

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
			consoleLog.log("isPaused##### videoOutput.paused2: " + videoOutput.paused);
			if (videoOutput.paused)
				videoOutput.play();

			document.getElementById("borderButton"+camNum).innerHTML = "Border Set";
			document.getElementById("objectButton"+camNum).disabled = false;


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
				//console.log("initialize_drawing data ##########: " + data);
				//alert("Data: " + data + "\nStatus: " + status);
				/*var jsonObj = JSON.parse(data);
				jsonObj[1].segments.length = 0;
				currentPathObject.importJSON(jsonObj);*/
				currentPathObject.importJSON(data);
			});

		consoleLog.log("coordinates.exportJSON(): " + coordinates.exportJSON());
	}

	function clearObjectDrawing() {
		if (typeof currentPathObject !== 'undefined')
			currentPathObject.remove();
	}

	function resetDefaultUI() {
		if (typeof(EventSource) !== "undefined") {
			if (typeof source !== 'undefined')
				source.close();
		}

		if (typeof currentPathObject !== 'undefined')
			currentPathObject.remove();
		if (typeof currentPathBorder !== 'undefined')
			currentPathBorder.remove();

		stopScreenshot(camNum);
		isPaused = false; //Set drawing function back to initial drawing

		document.getElementById("clearObjectDrawing"+camNum).style.display = "none";
		document.getElementById("objectButton"+camNum).innerHTML = "Track Object";
		document.getElementById("borderButton"+camNum).innerHTML = "Track Border";
		document.getElementById("objectTracker"+camNum).innerHTML = "Object Not Tracked";
		document.getElementById("objectTracker"+camNum).style.backgroundColor = "white";

		overlayTextCanvas();
	}

	function start() {
		if (!address.value) {
			window.alert("You must set the video source URL first");
			return;
		}
		if (!email.value) {
			window.alert("You must set the email first");
			return;
		}
		address.disabled = true;
		showSpinner(videoOutput);
		var options = {
			remoteVideo: videoOutput
		};

		resetDefaultUI();

		webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
			function(error) {
				if (error) {
					return consoleLog.error(error);
				}
				webRtcPeer.generateOffer(onOffer);
				webRtcPeer.peerConnection.addEventListener('iceconnectionstatechange', function(event) {
					if (webRtcPeer && webRtcPeer.peerConnection) {
						consoleLog.log("oniceconnectionstatechange -> " + webRtcPeer.peerConnection.iceConnectionState);
						consoleLog.log('icegatheringstate -> ' + webRtcPeer.peerConnection.iceGatheringState);

					}
				});
			});



	}

	function onOffer(error, sdpOffer) {
		if (error) return onError(error, consoleLog);

		kurentoClient(args.ws_uri, function(error, kurentoClient) {
			if (error) return onError(error, consoleLog);

			kurentoClient.create("MediaPipeline", function(error, p) {
				if (error) return onError(error, consoleLog);

				pipeline = p;

				pipeline.create("PlayerEndpoint", {
					uri: address.value
				}, function(error, player) {
					if (error) return onError(error, consoleLog);

					pipeline.create("WebRtcEndpoint", function(error, webRtcEndpoint) {
						if (error) return onError(error, consoleLog);

						//setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer, onError);
						setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer, onError, consoleLog);

						webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer) {
							if (error) return onError(error, consoleLog);

							webRtcEndpoint.gatherCandidates(onError);

							webRtcPeer.processAnswer(sdpAnswer);
						});


						player.connect(webRtcEndpoint, function(error) {
							if (error) return onError(error, consoleLog);

							consoleLog.log("PlayerEndpoint-->WebRtcEndpoint connection established");

							player.play(function(error) {
								if (error) return onError(error, consoleLog);

								consoleLog.log("Player playing ...");
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

		resetDefaultUI();

		//consoleLog.log("STOPPED FUNCTION()");

		if (typeof pathObject !== 'undefined')
			document.getElementById("test2").innerHTML = "pathObject: " + pathObject.segments.toString();
		if (typeof currentPathObject !== 'undefined')
			document.getElementById("test3").innerHTML = "currentPathObject: " + currentPathObject.segments.toString();
	}

	
	createPipeline.stop = stop;
	return createPipeline;

}; //createPipeline

function setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer, onError, console) {
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

function onError(error, console) {
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
