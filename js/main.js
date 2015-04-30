var array = [];

function message(id, data)
{
	console.log(id);
	console.log(data);
}

$(window).load(function()
{
	try{
		$("#start").click(startingApp);
		$("#stop").click(stoppingApp);
		
		tizen.filesystem.resolve('documents', readExerciseList, onResolveError, 'rw');
		
		document.addEventListener('tizenhwkey', function(e)
		{
			if (e.keyName == "back")
			{
				tizen.application.getCurrentApplication().exit();
			}

		});
		
		var element1 = document.getElementById("exerciseMenu");
		tau.event.enableGesture(element1, new tau.event.gesture.Swipe());
		element1.addEventListener("swipe", function(){});
		
		var element2 = document.getElementById("mainBody");
		tau.event.enableGesture(element2, new tau.event.gesture.Swipe());
		element2.addEventListener("swipe", function()
				{
					openExerciseMenu();
				});
		
		try
		{
			connection.addReceiveListener(message);
		}
		catch (e)
		{
			console.log(e);
		}
	
		$("#ErrorPopup").bind({popupshow: function(){connection.popupCheck = true;}, popuphide:  function(){connection.popupCheck = false;}});
			
		$("#connect").click(function(){
			tau.openPopup("#ErrorPopup");
		});
		
		$("#ErrorPopup_Close").click(function(){
			tizen.application.getCurrentApplication().exit();
		});
		
		$("#ErrorPopup_Connect").click(function(){
			connect();
		});
	
	
	}catch(e){
		console.log(e);
	}

});

function readExerciseList(dir)
{
	try
	{
		var documentsDir = dir;
		file = documentsDir.resolve('exerciseList.txt');
		file.openStream("r",readToStream,onResolveError);
	}
	catch (e)
	{
		console.log(e);
	}
}

function readToStream(fileStream){
	try {
	var test = fileStream.read(4096);
	
	var separator = 0;
	while(test.search(",") != -1)
	{
		var exerciseName = test.substring(separator,test.indexOf(","))
		var test = test.substring(test.indexOf(",")+1,test.length)
		array[array.length] = exerciseName;
	}
	fileStream.close();
	}catch(exc){
		console.log('Could not write to file: ' + exc.message);
	}
	
	var i = 0;
	while(i<array.length)
	{
		var tableRef = document.getElementById("exerciseTable");
		var newRow = tableRef.insertRow(i);
		newRow.style.height = "2em";
		newRow.style.borderBottom = "1pt solid yellow";
		var newCell  = newRow.insertCell(0);
		newCell.id = "exercise_" + array[i];
		var newText  = document.createTextNode(array[i]);
		newCell.appendChild(newText);
		$("#exercise_" + array[i]).click({exercisename: array[i]}, setExercise);
		i++;
	}
}

function startingApp()
{
	try
	{
		dataCollector.startDataCollector();
	}
	catch (e)
	{
		console.log(e);
	}
}

function setExercise(event)
{
	try
	{
		var exercise = event.data.exercisename;
		console.log(exercise);
		dbManager.setExercise(exercise);
		$('#exerciseName').html("Ex: "+ exercise);
		document.getElementById('mainBody').style.visibility = 'visible';
	}
	catch (e)
	{
		console.log(e);
	}
}

function openExerciseMenu(event)
{
	try
	{
		document.getElementById('mainBody').style.visibility = 'hidden';
	}
	catch (e)
	{
		console.log(e);
	}
}

function stoppingApp()
{
	try
	{
		dbManager.sendToPhone();
		dataCollector.stopDataCollector();
	}
	catch (e)
	{
		console.log(e);
	}
}

/**
 * Shows the Error message on console
 * @param e the Error
 */
function onResolveError(e) {
	console.log('message: ' + e.message);
}