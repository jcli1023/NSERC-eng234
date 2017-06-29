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

var movementsNum = 0;
var correctPredictionsNum = 0;

(function(){
	var MAX_CAMERAS = 4;
	var MAX_VID_SIZE_TEMP1_HEIGHT = 400;
	var MAX_VID_SIZE_TEMP1_WIDTH = 640;
	var MAX_VID_SIZE_TEMP2_HEIGHT = 300;
	var MAX_VID_SIZE_TEMP2_WIDTH = 400;
	var currentNumCams = 1;
	var pipelines = [];

	//Template 1
	function setTemplate1() {
		if (currentNumCams > 1) {
			//document.getElementById("test").innerHTML = "Template1";
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
		//document.getElementById("test2").innerHTML = currentNumCams;
	//	pipeline1.stop();
	}

	//Template 2
	function setTemplate2() {
		if (currentNumCams != 2)
		{
			//document.getElementById("test").innerHTML = "Template2";
			document.getElementById("videoOutput1").width = MAX_VID_SIZE_TEMP2_WIDTH;
			document.getElementById("videoOutput1").height = MAX_VID_SIZE_TEMP2_HEIGHT;
			document.getElementById("objectCam1").width = MAX_VID_SIZE_TEMP2_WIDTH;
			document.getElementById("objectCam1").height = MAX_VID_SIZE_TEMP2_HEIGHT;
			document.getElementById("borderCam1").width = MAX_VID_SIZE_TEMP2_WIDTH;
			document.getElementById("borderCam1").height = MAX_VID_SIZE_TEMP2_HEIGHT;
			document.getElementById("template2").style.display = "inline";
			currentNumCams = 2;
			//document.getElementById("test2").innerHTML = currentNumCams;
			//overlayTextCanvas();
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

	window.addEventListener("load", function(){ pipelines.push(new createPipeline(currentNumCams));
		var template1Button = document.getElementById("template1Button");
		var template2Button = document.getElementById("template2Button");		
		template1Button.onclick = setTemplate1;
		template2Button.onclick = setTemplate2;	
	});
	
})();

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

function createPipeline(camNum) {

	var createPipeline = {};
	var OBJECT_SCOPE = 0;
	var BORDER_SCOPE = 1;
	var zFRONT = 1000;
	var zBACK = 500;
	
	var paperScopes = [];
	paperScopes[OBJECT_SCOPE] = new paper.PaperScope();
	paperScopes[BORDER_SCOPE] = new paper.PaperScope();

	var objectCam = document.getElementById("objectCam"+camNum);
	var borderCam = document.getElementById("borderCam"+camNum);
	paperScopes[OBJECT_SCOPE].setup(objectCam);
	paperScopes[BORDER_SCOPE].setup(borderCam);

	//paperScopes[0].setup("objectCam1");
	//paperScopes[1].setup("borderCam1");

	var consoleLog = new Console('console'+camNum, console);
	var consoleWindow = document.getElementById("console"+camNum);

	var videoOutput = document.getElementById('videoOutput'+camNum);
	var address = document.getElementById('address'+camNum);

	var pipeline;
	var webRtcPeer;

	var frameDim = []; //dimensions of the frames
	var vidDim = []; //dimensions of the video
	var timeFrame //year month date hours minutes seconds milliseconds
	var drawTimer = null;

	var currentPathObject;
	var currentPathBorder;
	var objectTrackTool;
	var borderTrackTool;
	var borderCoordinates = []; //Array of the border coordinates

	var isPaused = false;
	var source; //eventSource for server sided events

	var objectButton = document.getElementById("objectButton"+camNum);
	var borderButton = document.getElementById("borderButton"+camNum);
	var clearObjectDrawingButton = document.getElementById("clearObjectDrawing"+camNum);
	var clearBorderDrawingButton = document.getElementById("clearBorderDrawing"+camNum);
	var objectTrackerText = document.getElementById("objectTracker"+camNum);
	var classifiedMovementText = document.getElementById("classifiedMovement"+camNum);


	var dumbCount = 0;
	var trajectoryLog = [];
	var trajectoryLogFinal = []; //trajectory points for classification
	var classifiedMovement = "";
	var beginTimeInterval;
	var endTimeInterval;
	var totalTimeInterval;
/*
	if (camNum == 1)
		address.value = 'rtsp://192.168.41.129:8554/test_vid.mkv';
	else if (camNum == 2)
		address.value = 'rtsp://192.168.41.129:8554/test_vid03.mkv';
*/
	if (camNum == 1)
		address.value = 'rtsp://dsmp.ryerson.ca:8000/hcircle/hcircle-right15.mkv';
	else if (camNum == 2)
		address.value = 'rtsp://dsmp.ryerson.ca:8000/hcircle/hcircle-right12.mkv';

	email = document.getElementById('email'+camNum);
	email.value = 'testdsmp@dsmp.ryerson.ca';

	//var movementLabel = document.getElementById('movement'+camNum);
	//movementLabel.value = "Half-Circle";

	var timingLabel = document.getElementById('timing'+camNum);
	var resultProgramOutput = document.getElementById('resultPrograms'+camNum);

	kmeansButton = document.getElementById("kmeansButton");
	kmeansButton.addEventListener('click', kmeansProgram);

	trainButton = document.getElementById("trainButton");
	trainButton.addEventListener('click', trainProgram);

	svmButton = document.getElementById("svmButton");
	svmButton.addEventListener('click', svmProgram);

	svmBatchButton = document.getElementById("svmBatchButton");
	svmBatchButton.addEventListener('click', svmBatchProgram);

	startButton = document.getElementById('start'+camNum);
	startButton.addEventListener('click', start);

	stopButton = document.getElementById('stop'+camNum);
	stopButton.addEventListener('click', stop);

	submitCheckButton = document.getElementById('submitCheck'+camNum);
	submitCheckButton.addEventListener('click', submitCheck);

	clearObjectDrawingButton.style.display = "none";
	clearObjectDrawingButton.addEventListener('click',function(){ clearDrawings(OBJECT_SCOPE); });

	clearBorderDrawingButton.style.display = "none";
	clearBorderDrawingButton.addEventListener('click',function(){ clearDrawings(BORDER_SCOPE); });

	objectButton.addEventListener("click", drawObject);
	borderButton.addEventListener("click", drawBorder);	
//	document.getElementById("objectButton"+camNum).addEventListener("click", drawObject);
//	document.getElementById("borderButton"+camNum).addEventListener("click", drawBorder);

	videoOutput.addEventListener("pause", function() {
		stopScreenshot(camNum);
	});
	videoOutput.addEventListener("playing", function() {
		startScreenshot(camNum);
	});

	function refreshConsoleScroll()
	{
		consoleWindow.scrollTop = consoleWindow.scrollHeight;
	}

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

				//document.getElementById("debug"+camNum).innerHTML = data + " " + status + " " + dumbCount;
				//alert("Data: " + data + "\nStatus: " + status);
			});
	}

	function sendEmail(camNum) {
		var reportDateFrame = new Date();
		var reportTimeFrame = reportDateFrame.getFullYear()+"-"+ reportDateFrame.getMonth() +"-"+ reportDateFrame.getDate() + "_" + reportDateFrame.getHours()+":" + reportDateFrame.getMinutes()+":" + reportDateFrame.getSeconds() +":"+ reportDateFrame.getMilliseconds();

		$.post("email.php", {
			email: email.value,
			time: reportTimeFrame,
			camNum: camNum
		},
		function(data, status) {

			consoleLog.log("CAM " + camNum + ": OBJECT MISSING : " + reportTimeFrame);
			consoleLog.log(data);
		});
	}

	function setMissingTrackerText()
	{
		objectTrackerText.innerHTML = "OBJECT MISSING";
		objectTrackerText.style.backgroundColor = 'red';
	}
	
	function setFoundTrackerText()
	{
		objectTrackerText.innerHTML = "OBJECT TRACKED";
		objectTrackerText.style.backgroundColor = 'green';
	}

	function drawObject() {
		//Brings objectCam1 canvas to front for mouse events, borderCam1 canvas to back

		objectCam.style.zIndex = zFRONT;
		borderCam.style.zIndex = zBACK;
		//document.getElementById("objectCam"+camNum).style.zIndex = zFRONT;
		//document.getElementById("borderCam"+camNum).style.zIndex = zBACK;
		
		//consoleLog.log("entered drawObject()");
		//consoleLog.log("isPaused: "+isPaused);
		if (!isPaused) {
			//consoleLog.log("!isPaused### videoOutput.paused: " + videoOutput.paused);

			isPaused = true;

			if (typeof(EventSource) !== "undefined") {
				if (typeof source !== 'undefined')
				{	
					source.close();
					objectTrackerText.innerHTML = "Object Not Tracked";
					objectTrackerText.style.backgroundColor = "white";				

				}
			}

			clearDrawings(OBJECT_SCOPE);

			if (!videoOutput.paused) {

				//consoleLog.log("Entered here");
				videoOutput.pause();
				grabScreenshot(camNum);

			}

			objectButton.innerHTML = "Drawn Object of Interest";
			borderButton.disabled = true;
			clearObjectDrawingButton.style.display = "inline";

			paper = paperScopes[OBJECT_SCOPE];

			function onMouseDown(event) {
				currentPathObject = new paper.Path();
				currentPathObject.strokeColor = 'blue';
				currentPathObject.add(event.point);
			}

			objectTrackTool = new paper.Tool();
			objectTrackTool.onMouseDown = onMouseDown;


			objectTrackTool.onMouseDrag = function(event) {
				currentPathObject.add(event.point);
			}

			trajectoryLog.length = 0; //Clears list by setting length to 0
			trajectoryLogFinal.length = 0;


		}	
		else if (isPaused) {
			isPaused = false;
			//consoleLog.log("isPaused##### videoOutput.paused2: " + videoOutput.paused);


			objectButton.innerHTML = "Tracking Object";
			borderButton.disabled = false;
			objectTrackerText.innerHTML = "Object Tracking";
			clearObjectDrawingButton.style.display = "none";

			objectTrackTool.remove();

			initializeDrawings(camNum, currentPathObject);

			if (videoOutput.paused)
				videoOutput.play();


			beginTimeInterval = performance.now();

			//previousSSETime = performance.now();
			//When server sends information to client
			if (typeof(EventSource) !== "undefined") {
				//consoleLog.log("entered EventSource");
				source = new EventSource("sse_test.php?camNum=" + camNum);
				source.onmessage = function(event) {
					//currentSSETime = performance.now();
					//consoleLog.log("SSE Response: " + (currentSSETime - previousSSETime));
					//previousSSETime = currentSSETime;
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

						sendEmail(camNum);
						setMissingTrackerText();

					} 
					//Object is found inside video frame
					else {
						var objectInsideBorder = true;

						//consoleLog.log("currentPathBorder: "+currentPathBorder);
						//consoleLog.log("borderCoordinates: "+borderCoordinates);

						//If there is a defined border, check if object is inside the border
						if (typeof currentPathBorder !== "undefined")
						{	
							//Check border only if it is drawn as more than a single point
							if (currentPathBorder.segments.length > 0)
							{
								//consoleLog.log("currentPathBorder defined");
								//consoleLog.log("object segs: "+jsonObj[1].segments);
								for (i = 0; i < jsonObj[1].segments.length; i++)
								{
									objectInsideBorder = insideBorder(jsonObj[1].segments[i],borderCoordinates);
									if (!objectInsideBorder)
										break;
								}
							}
						}					
						
						if (!objectInsideBorder){
							sendEmail(camNum);
							setMissingTrackerText();
						}
						else
							setFoundTrackerText();
							
					}
					
					trajectory = jsonObj[5].trajectoryCenter;
					consoleLog.log("Trajectory: "+trajectory[0]+","+trajectory[1]);

					trajectoryLog.push({x: trajectory[0], y: trajectory[1]});
					//consoleLog.log(JSON.stringify(trajectoryLog));
					//consoleLog.log(trajectoryLog.length);

					refreshConsoleScroll();
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
				refreshConsoleScroll();
			}

			//if (typeof currentPathObject !== 'undefined')
				//document.getElementById("debug"+camNum).innerHTML = "currentPathObject: " + currentPathObject.exportJSON({
				//	asString: true
				//});

		}

		//consoleLog.log("before exit isPaused: "+isPaused);
	}

	function drawBorder() {
		//Brings borderCam1 canvas to front for mouse events, objectCam1 canvas to back
		
		objectCam.style.zIndex = zBACK;
		borderCam.style.zIndex = zFRONT;
		
		//consoleLog.log("entered drawObject()");
		if (!isPaused) {
			//consoleLog.log("!isPaused### videoOutput.paused: " + videoOutput.paused);

			isPaused = true;

			clearDrawings(BORDER_SCOPE);

			if (!videoOutput.paused) {

				//consoleLog.log("Entered here");
				videoOutput.pause();
				grabScreenshot(camNum);

			}

			borderButton.innerHTML = "Drawn Border";
			objectButton.disabled = true;
			clearBorderDrawingButton.style.display = "inline";

			paper = paperScopes[BORDER_SCOPE];

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

			borderButton.innerHTML = "Border Set";
			objectButton.disabled = false;
			clearBorderDrawingButton.style.display = "none";

			borderTrackTool.remove();

			for (i = 0; i < currentPathBorder.segments.length; i++)
			{
				var point = [];
				var xCoord = currentPathBorder.segments[i].point.x;
				var yCoord = currentPathBorder.segments[i].point.y;
				point = [xCoord,yCoord];
				borderCoordinates.push(point);

			}
//			for (i = 0; i < borderCoordinates.length; i++)
//			{
//				consoleLog.log(borderCoordinates[i]);
//				refreshConsoleScroll();
//			}

			if (videoOutput.paused) 
				videoOutput.play();
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

		//consoleLog.log("coordinates.exportJSON(): " + coordinates.exportJSON());
	}

	function insideBorder(point, border) {
	    // ray-casting algorithm based on
	    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

	    var x = point[0], y = point[1];

	    var insidePoly = false;
	    for (var i = 0, j = border.length - 1; i < border.length; j = i++) {
		var xi = border[i][0], yi = border[i][1];
		var xj = border[j][0], yj = border[j][1];

		var intersect = ((yi > y) != (yj > y))
		    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) insidePoly = !insidePoly;
	    }

	    return insidePoly;
	}

	function clearDrawings(scope) {
		paper = paperScopes[scope];
		var projectsLength = paper.projects.length;
		for(i = 0; i < projectsLength; i++)
		{
			paper.projects[i].clear();
		}
		if (scope == OBJECT_SCOPE)
		{
			currentPathObject = void 0;
//			if (typeof currentPathObject !== 'undefined')
//			{
//				currentPathObject.removeSegments();
//			}
		}
		else if (scope == BORDER_SCOPE)
		{
			borderCoordinates = [];
			currentPathBorder = void 0;
//			if (typeof currentPathBorder !== 'undefined')
//			{
//				currentPathBorder.removeSegments();				
//			}
		}
	}

	//Not Complete
	function kmeansProgram() {
		consoleLog.log("-------K-MEANS------------");
		var beginTimeKmeans = performance.now();
		if (trajectoryLog.length < 60) {
			if (trajectoryLog.length < 1)
			{
				trajectoryLog.push({x: 0, y: 0});
			}
			var tempTrajectoryLog = trajectoryLog.slice(0);
			while (tempTrajectoryLog.length < 60) {
				//tempTrajectoryLog.unshift(trajectoryLog[0]);
				tempTrajectoryLog.push(trajectoryLog[trajectoryLog.length-1]);
			}
			trajectoryFinal = tempTrajectoryLog;
			//consoleLog.log(JSON.stringify(tempTrajectoryLog));
		}
		else
		{
			trajectoryFinal = trajectoryLog.slice(Math.max(trajectoryLog.length - 60, 0))
		}
	
		//consoleLog.log(JSON.stringify(trajectoryFinal));

		$.post("kmeans.php", {
		},
		function(data, status) {
			var endTimeKmeans = performance.now();
			var cleanLookingData  = data.replace(/;/g, "</br></br>")
			resultProgramOutput.innerHTML = cleanLookingData;
			//resultProgramOutput.innerHTML = data;
			//calculateCorrectLabels();
			timingLabel.innerHTML = "K-Means Timing: " + (endTimeKmeans-beginTimeKmeans) + " ms";
		});

	}

	function svmBatchProgram() {
		consoleLog.log("-------SVM BATCH------------");
		var beginTimeSVMBatch = performance.now();
		if (trajectoryLog.length < 60) {
			if (trajectoryLog.length < 1)
			{
				trajectoryLog.push({x: 0, y: 0});
			}
			var tempTrajectoryLog = trajectoryLog.slice(0);
			while (tempTrajectoryLog.length < 60) {
				//tempTrajectoryLog.unshift(trajectoryLog[0]);
				tempTrajectoryLog.push(trajectoryLog[trajectoryLog.length-1]);
			}
			trajectoryFinal = tempTrajectoryLog;
			//consoleLog.log(JSON.stringify(tempTrajectoryLog));
		}
		else
		{
			trajectoryFinal = trajectoryLog.slice(Math.max(trajectoryLog.length - 60, 0))
		}
	
		//consoleLog.log(JSON.stringify(trajectoryFinal));

		$.post("svm_batch.php", {
		},
		function(data, status) {
			var endTimeSVMBatch = performance.now();
			var cleanLookingData  = data.replace(/;/g, "</br></br>")
			resultProgramOutput.innerHTML = cleanLookingData;
			//resultProgramOutput.innerHTML = data;
			//calculateCorrectLabels();
			timingLabel.innerHTML = "SVM Batch Timing: " + (endTimeSVMBatch-beginTimeSVMBatch) + " ms";
		});

	}

	function trainProgram() {

		fixTrajectoryLength();

//		writeTrainingData();

		$.post("train_models.php", {
		},
		function(data, status) {
			resultProgramOutput.innerHTML = "Finished Training Models";
		});
	}

	function svmProgram() {
		//consoleLog.log("-------Classifiers------------");
		var beginTimeSVM = performance.now();
		resetClassifiedMovementText();
		svmButton.innerHTML = "Classifying...";
		movementsNum++;

		fixTrajectoryLength();
	
		//consoleLog.log(JSON.stringify(trajectoryFinal));

		$.post("write_test_traj_data.php", {
			traj_data : JSON.stringify(trajectoryFinal),
			//movementLabel: movementLabel.value
		},
		function(data, status) {
			consoleLog.log(data);
		});


		$.post("svm.php", {
		},
		function(data, status) {
			var endTimeSVM = performance.now();
			//consoleLog.log(data);
			classifiedMovement = data;
			classifiedMovementText.innerHTML = "Classified Movement: " + classifiedMovement;

			/*
			//Trim any white spaces
			if (strcmp(movementLabel.value.trim(),data.trim())==0)
			{
				
				correctPredictionsNum++;
				classifiedMovementText.style.backgroundColor = "green";
			}
			else
			{
				classifiedMovementText.style.backgroundColor = "red";
			}
			*/
			//calculateCorrectLabels();
			svmButton.innerHTML = "SVM Real-Time";
			timingLabel.innerHTML = "SVM Timing: " + (endTimeSVM-beginTimeSVM) + " ms";

			
		});

//		writeTrainingData();

	}

	function fixTrajectoryInterval()
	{
		var numTrajPoints = trajectoryLog.length;
		var newTrajectoryLog = [];
		var steps;
		var currentStep = 0;
		steps = Math.floor (numTrajPoints/totalTimeInterval);
		if (steps < 1)
			steps = 1;
		while (currentStep < numTrajPoints-1)
		{
			newTrajectoryLog.push(trajectoryLog[currentStep]);
			currentStep += steps;
		}
		
		trajectoryLog = newTrajectoryLog;
		consoleLog.log(JSON.stringify(trajectoryLog));
		consoleLog.log("totalTimeInterval: " + totalTimeInterval);
		consoleLog.log("steps: " + steps);	
	}

	function fixTrajectoryLength()
	{
		if (trajectoryLog.length < 60) {
			if (trajectoryLog.length < 1)
			{
				trajectoryLog.push({x: 0, y: 0});
			}
			var tempTrajectoryLog = trajectoryLog.slice(0);
			while (tempTrajectoryLog.length < 60) {
				//tempTrajectoryLog.unshift(trajectoryLog[0]);
				tempTrajectoryLog.push(trajectoryLog[trajectoryLog.length-1]);
			}
			trajectoryFinal = tempTrajectoryLog;
			//consoleLog.log(JSON.stringify(tempTrajectoryLog));
		}
		else
		{
			trajectoryFinal = trajectoryLog.slice(Math.max(trajectoryLog.length - 60, 0))
		}
	}

	function submitCheck() {
		var correctButton = document.getElementById("correctCheck1");
		var response;
		if (correctButton.checked)
		{
			correctPredictionsNum++;
			response = "correct";
		}
		else
			response = "incorrect";
		
		$.post("write_responses.php", {
			response : response,
			traj_data : JSON.stringify(trajectoryFinal),
			predicted : classifiedMovement
		},
		function(data, status) {

		});
		calculateCorrectLabels();
	}

	function writeTrainingData()
	{
		var videoName = address.value;
		var movementName = "";
		if (videoName.search("hcircle") > -1)
		{
			movementName = "Half-Circle";
		}
		else if (videoName.search("sine") > -1)
		{
			movementName = "Sine";
		}
		else if (videoName.search("line") > -1)
		{
			movementName = "Line";
		}
		$.post("write_train_traj_data.php", {
			traj_data : JSON.stringify(trajectoryFinal),
			movementName: movementName
		},
		function(data, status) {
		});
	}

	function resetDefaultUI() {
		if (typeof(EventSource) !== "undefined") {
			if (typeof source !== 'undefined')
				source.close();
		}
		
		clearDrawings(OBJECT_SCOPE);
		clearDrawings(BORDER_SCOPE);

		if (typeof objectTrackTool !== 'undefined')
			objectTrackTool.remove();

		if (typeof borderTrackTool !== 'undefined')
			borderTrackTool.remove();
		
		//if (typeof currentPathObject !== 'undefined')
		//	currentPathObject.remove();
		//if (typeof currentPathBorder !== 'undefined')
		//	currentPathBorder.remove();

		stopScreenshot(camNum);
		isPaused = false; //Set drawing function back to initial drawing

		clearObjectDrawingButton.style.display = "none";
		clearBorderDrawingButton.style.display = "none";
		objectButton.innerHTML = "Track Object";
		objectButton.disabled = false;
		borderButton.innerHTML = "Track Border";
		borderButton.disabled = false;
		objectTrackerText.innerHTML = "Object Not Tracked";
		objectTrackerText.style.backgroundColor = "white";
		svmButton.innerHTML = "SVM Real-Time";
		resultProgramOutput.innerHTML = "";

		timingLabel.innerHTML = "Timing: ";
		resetClassifiedMovementText();

		//document.getElementById("clearObjectDrawing"+camNum).style.display = "none";
		//document.getElementById("objectButton"+camNum).innerHTML = "Track Object";
		//document.getElementById("objectButton"+camNum).disabled = false;
		//document.getElementById("borderButton"+camNum).innerHTML = "Track Border";
		//document.getElementById("borderButton"+camNum).disabled = false;
		//document.getElementById("objectTracker"+camNum).innerHTML = "Object Not Tracked";
		//document.getElementById("objectTracker"+camNum).style.backgroundColor = "white";

		//overlayTextCanvas();
	}

	function resetClassifiedMovementText()
	{
		classifiedMovementText.innerHTML = "Classified Movement: ";
		classifiedMovementText.style.backgroundColor = "white";
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

		consoleLog.log("currentPathObject def?: "+currentPathObject);
		consoleLog.log("currentPathBorder def?: "+currentPathBorder);
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
						refreshConsoleScroll();
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
							refreshConsoleScroll();

							player.play(function(error) {
								if (error) return onError(error, consoleLog);

								consoleLog.log("Player playing ...");
								refreshConsoleScroll();
							});
						});
					});
				});
			});

		});
	}
	//	this.stop = function() {
	function stop() {
		endTimeInterval = performance.now();
		totalTimeInterval = (endTimeInterval - beginTimeInterval) / 1000;
		fixTrajectoryInterval();
		fixTrajectoryLength();
		writeTrainingData();

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

		
//		trajectoryLog.length = 0; //Clears list by setting length to 0
//		trajectoryLogFinal.length = 0;
		
		resetDefaultUI();

		//consoleLog.log("STOPPED FUNCTION()");

		//if (typeof pathObject !== 'undefined')
			//document.getElementById("test2").innerHTML = "pathObject: " + pathObject.segments.toString();
		//if (typeof currentPathObject !== 'undefined')
			//document.getElementById("test3").innerHTML = "currentPathObject: " + currentPathObject.segments.toString();
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


function calculateCorrectLabels()
{
	var correctPercentage = (correctPredictionsNum / movementsNum) * 100;
	var correctTotalLabel = document.getElementById("correctTotal");
	correctTotalLabel.innerHTML = "CORRECT: " + correctPercentage + "%	" + correctPredictionsNum + "/" + movementsNum;
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

function strcmp(a, b) {
    if (a.toString() < b.toString()) return -1;
    if (a.toString() > b.toString()) return 1;
    return 0;
}

/**
 * Lightbox utility (to display media pipeline image in a modal dialog)
 */
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
	event.preventDefault();
	$(this).ekkoLightbox();
});
