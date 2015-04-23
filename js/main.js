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
		
		$("#exercise_arm_pull").click({exercisename: "pull_arm"}, setExercise);
		$("#exercise_twist_arm").click({exercisename: "twist_arm"}, setExercise);
		$("#exercise_shoulder").click({exercisename: "shoulder"}, setExercise);
		
		document.addEventListener('tizenhwkey', function(e)
		{
			if (e.keyName == "back")
			{
				tizen.application.getCurrentApplication().exit();
			}
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
		
		$('.contents').on("click", function()
		{
			$('#textbox').html($('#textbox').html() == "Basic" ? "Sample" : "Basic");
			connect();
			console.log("Try connecting")
		});
		
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
		window.location = "index.html"
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