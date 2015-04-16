var Dataset = [];
var accelX;
var accelY;
var accelZ;
var rotx;
var roty;
var rotz;
var startTime;
var initTime;
var checkTime;


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
		checkTime = new Date().getTime() - 100;
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
	initTime = new Date().getTime();
	if(initTime - 100 > checkTime){
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
			checkTime = initTime;		
		}
}

function showData()
{
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