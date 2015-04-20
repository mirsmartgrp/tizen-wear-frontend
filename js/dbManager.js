var result;

/**
 * adds the Datasets into a Json file
 */
function saveAsJSON(){
	var dataset = getDataset();
	
	result = {};
	
	result.data =  dataset;

	tizen.filesystem.resolve('documents', onResolveSuccess, onResolveError, 'rw');	
	
//	console.log(JSON.stringify(result));
}

function sendToPhone()
{
	var dataset = getDataset();
	result = {};
	result.data =  dataset;
	sendData(JSON.stringify(result));
}

var documentsDir;
var file;

/**
 * Saves the File on to the watch on success
 * @param dir Path of save Folder
 */
function onResolveSuccess(dir) {
	documentsDir = dir;
	file = documentsDir.createFile('test_data_'+startTime+'.json');
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
