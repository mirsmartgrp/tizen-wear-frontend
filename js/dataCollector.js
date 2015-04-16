var Dataset = [];
var accelX;
var accelY;
var accelZ;
var rotx;
var roty;
var rotz;
var startTime;


function getDataset()
{
	return Dataset;
}

function startDataCollector()
{
	try
	{
		window.addEventListener('devicemotion', handleDataCollector);
		startTime = new Date().getTime();
	}
	catch (e)
	{
		console.log(e)
	}
	console.log("Start DataCollector");
}

function stopDataCollector()
{
	window.removeEventListener('devicemotion', handleDataCollector);
	console.log("Stop DataCollector");
}



function handleDataCollector(e)
{
	console.log("Handle Data");
	try
	{
		accelX = e.acceleration.x;
		accelY = -(e.acceleration.y);
		accelZ = -(e.acceleration.z);
		rotx = e.rotationRate.alpha;
		roty = e.rotationRate.beta;
		rotz = e.rotationRate.gamma;

		Dataset.push({
			accel : {
				x : accelX,
				y : accelY,
				z : accelZ
			},
			gyro : {
				x : accelX,
				y : accelY,
				z : accelZ
			},
			time : ((new Date().getTime()) - startTime) / 1000
		});

		showData();
	}
	catch (e)
	{
		console.log(e);
	}
}

function showData()
{
	console.log("Show data");
	try{
	var x = 
	$('#accelX').html('Accel X : ' + Math.round(accelX * 100) / 100);
 	$("#accelY").html('Accel Y : ' + Math.round(accelY * 100) / 100);
	$("#accelZ").html('Accel Z : ' + Math.round(accelZ * 100) / 100);
	$("#rotX").html("Rot X :" + Math.round(rotx * 100) / 100);
	$("#rotY").html("Rot Y :" + Math.round(roty * 100) / 100);
	$("#rotZ").html("Rot Z :" + Math.round(rotz * 100) / 100);
	}catch(e){
		console.log(e);
	}
	};