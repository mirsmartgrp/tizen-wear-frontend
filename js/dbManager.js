var dbManager = (function(){
	var my = {};
	var result;
	var exercise;
	var json;
	
	/**
	 * sets exercise name
	 * @param exercisename
	 */
	my.setExercise = function(exercisename)
	{
		exercise = exercisename;
	}
	
	my.createExerciseJson = function(dir)
	{		
		var documentsDir = dir;
		file = documentsDir.resolve('exercise_list.txt');
		file.openStream("r",readToStream,onResolveError);
	}
	
	my.getExerciseJson = function()
	{
			return json;
	}
	
	function readToStream(fileStream)
	{
		try {
			var test = fileStream.read(4096);
			json = JSON.parse(test);
			fileStream.close();
		}catch(exc){
			console.log('Could not write to file: ' + exc.message);
		}
	}
	
	/**
	 * sets exercise name
	 * @param exercisename
	 */
	my.setExerciseById = function(exerciseid)
	{
		exerciseid;
	}
	
	/**
	 * adds the Datasets into a Json file
	 */
	my.saveDatasetAsJSON = function(){
		var dataset = dataCollector.getDataset();
		
		result = {};
		
		result.guid = exercise;
		result.sensorData =  dataset;
	
		tizen.filesystem.resolve('documents', onResolveSuccess, onResolveError, 'rw');	
		
	//	console.log(JSON.stringify(result));
	}
	
	/**
	 * adds the ExerciseList into a Json file
	 */
	my.saveExerciseListAsJSON = function(exerciseListString)
	{
		result = JSON.parse(exerciseListString);
		tizen.filesystem.resolve('documents', onResolveSuccessExerciseList, onResolveError, 'rw');	
	}
	
	/**
	 * adds the Datasets into a Json file and sends it to the connected phone
	 */
	my.sendToPhone = function()
	{
		var dataset = dataCollector.getDataset();
		result = {};
		result.guid = exercise;
		result.sensorData =  dataset;
		console.log(JSON.stringify(result));
		connection.sendData(JSON.stringify(result));
	}
	
	var documentsDir;
	var file;
	
	/**
	 * Saves the File on to the watch on success
	 * @param dir Path of save Folder
	 */
	function onResolveSuccess(dir) {
		documentsDir = dir;
		file = documentsDir.createFile('test_data_'+ dataCollector.startTime+'.json');
		file.openStream("rw",writeToStream,onResolveError);
	}
	
	/**
	 * Saves the File on to the watch on success
	 * @param dir Path of save Folder
	 */
	function onResolveSuccessExerciseList() {
		file = documentsDir.deleteFile('exercise_list.txt');
		file = documentsDir.createFile('exercise_list.txt');
		file.openStream("rw",writeToStream,onResolveError);
	}
	 
	/**
	 * Shows the Error message on console
	 * @param e the Error
	 */
	function onResolveError(e) {
		console.log('message: ' + e.message);
	}
	
	/**
	 * Writes onto the watch
	 * @param fileStream
	 */
	function writeToStream(fileStream){
		try {
		fileStream.write(JSON.stringify(result));
		fileStream.close();
		}catch(exc){
			console.log('Could not write to file: ' + exc.message);
		}
	} 

return my;
}($));