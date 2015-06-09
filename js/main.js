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
		$("#learn").click(startingLearning);
		$("#stop").click(stoppingApp);
		
		tizen.filesystem.resolve('documents', dbManager.createExerciseJson, onResolveError, 'rw');
		createExerciseList();
		
		document.addEventListener('tizenhwkey', function(e)
		{
			if (e.keyName == "back")
			{
				tizen.application.getCurrentApplication().exit();
			}

		});
		
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


/**
 * 
 * @param fileStream
 */
function createExerciseList(){
		var json = dbManager.getExerciseJson();
		console.log(json);
		
	for(var i = 0; i<json.exercises.length; i++)
	{
		var tableRef = document.getElementById("exerciseTable");
		var newRow = tableRef.insertRow(i);
		newRow.style.height = "2em";
		newRow.style.borderBottom = "1pt solid yellow";
		var newCell  = newRow.insertCell(0);
		newCell.id = "exercise_" + json.exercises[i].guid;
		var newText  = document.createTextNode(json.exercises[i].name);
		newCell.appendChild(newText);
		$("#exercise_" + json.exercises[i].guid).click({exerciseid: json.exercises[i].guid, exercisename: json.exercises[i].name}, setExercise);
	}
}

/**
 * 
 */
function startingApp()
{
	dataCollector.setLearn(0);
	window.setTimeout(startDataCollecting, 2000);
}


/**
 * 
 */
function startDataCollecting()
{
	try
	{
		navigator.vibrate(1000);
		dataCollector.startDataCollector();
	}
	catch (e)
	{
		console.log(e);
	}
}

/**
 * 
 */
function startingLearning(){
	dataCollector.setLearn(2000);
	dataCollector.setLearnCounter(0);
	window.setTimeout(startDataCollecting, 2000);
	
}

/**
 * 
 * @param event
 */
function setExercise(event)
{
	try
	{
		var exercisename = event.data.exercisename;
		var exerciseid = event.data.exerciseid;
		dbManager.setExercise(exerciseid);
		$('#exerciseName').html(exercisename);
		document.getElementById('mainBody').style.visibility = 'visible';
		document.getElementById('exerciseMenu').style.visibility = 'hidden';
		$('#exerciseTable').remove();
	}
	catch (e)
	{
		console.log(e);
	}
}

/**
 * 
 * @param event
 */
function openExerciseMenu(event)
{
	try
	{
		document.getElementById('mainBody').style.visibility = 'hidden';
		document.getElementById('exerciseMenu').style.visibility = 'visible';
		var ele = document.createElement("TABLE");
		ele.id = "exerciseTable";
		ele.style.fontSize = "1.5em";
		document.getElementById('exerciseMenu').appendChild(ele);
		tizen.filesystem.resolve('documents', readExerciseList, onResolveError, 'rw');
	}
	catch (e)
	{
		console.log(e);
	}
}

/**
 * 
 */
function stoppingApp()
{
	console.log("STOPP");
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