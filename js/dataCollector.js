	var Dataset = [];

	function getDataset(){
		 return Dataset;		
	}	

	function startDataCollector() {
		window.addEventListener('devicemotion', handleDataCollector);
		console.log("Start DataCollector");
    }
    
    function stopDataCollector() {
        window.removeEventListener('devicemotion', handleDataCollector);
        console.log("Stop DataCollector");
    }

    function handleDataCollector(e) {
		accelX = e.acceleration.x;
		accelY = -(e.acceleration.y);
		accelZ = -(e.acceleration.z);
		rotx = e.rotationRate.alpha ;
		roty = e.rotationRate.beta ;
		rotz = e.rotationRate.gamma ;
		
		Dataset.push({ 
			accel :{x: accelX, y: accelY, z:accelZ}, 
			gyro :{x: accelX, y: accelY, z:accelZ} ,
			time : ((new Date().getTime())-startTime)/1000
		});
		
		showData();
    }

    function showData() {
		document.getElementById("accelX").innerHTML =  'Accel X : ' + Math.round(accelX*100)/100;
	   	document.getElementById("accelY").innerHTML = 'Accel Y : ' + Math.round(accelY*100)/100;
	   	document.getElementById("accelZ").innerHTML = 'Accel Z : ' + Math.round(accelZ*100)/100;
	   	document.getElementById("rotX").innerHTML = "Rot X :" + Math.round(rotx*100)/100;
	   	document.getElementById("rotY").innerHTML = "Rot Y :" + Math.round(roty*100)/100;
	   	document.getElementById("rotZ").innerHTML = "Rot Z :" + Math.round(rotz*100)/100;
	};   