var result;

function saveAsJSON(){
	var dataset = getDataset();
	
	result = {};
	
	result.data =  dataset;

	tizen.filesystem.resolve('documents', onResolveSuccess, onResolveError, 'rw');
	
	
//	console.log(JSON.stringify(result));
	

}



var documentsDir;
var file;
function onResolveSuccess(dir) {
	documentsDir = dir;
	file = documentsDir.createFile('test_data_'+startTime+'.json');
	file.openStream("rw",writeToStream,onResolveError);
}
 
function onResolveError(e) {
	console.log('message: ' + e.message);
}

function writeToStream(fileStream){
	try {
	fileStream.write(JSON.stringify(result));
	fileStream.close();
	}catch(exc){
		console.log('Could not write to file: ' + exc.message);
	}
} 
