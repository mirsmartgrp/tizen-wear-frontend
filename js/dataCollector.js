var dataCollector = (function(){
	
	var my ={};
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
	
	my.startTime = startTime;
	
	/**
	 * Returns a set of all data
	 * @returns {Array} Containing all rotation and acceleration data
	 */
	my.getDataset = function()
	{
		return Dataset;
	}
	
	/**
	 * Adds the listener to start the data collecting
	 */
	my.startDataCollector = function()
	{
		try
		{
			Dataset = [];
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
	
	my.stopDataCollector = function()
	{
		window.removeEventListener('devicemotion', handleDataCollector);
		console.log("Stop DataCollector");
	}
	
	/**
	 * puts the data into a dataset with a timestamp
	 * @param e
	 */
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
			
					if(accelX == null){accelX = 0;}
					if(accelY == null){accelY = 0;}
					if(accelZ == null){accelZ = 0;}
					
					if(rotx == null){rotx = 0;}
					if(roty == null){roty = 0;}
					if(rotz == null){rotz = 0;}
					
					Dataset.push({
						accelerometer : {
							x : accelX,
							y : accelY,
							z : accelZ
						},
						gyroscope : {
							x : accelX,
							y : accelY,
							z : accelZ
						},
						time : ((new Date().getTime()) - startTime) / 1000
					});
					
					$("#timer").html(((new Date().getTime()) - startTime) / 1000);
				}
				catch (e)
				{
					console.log(e);
				}
				checkTime = initTime;		
			}
	}
	
	return my;
}($));