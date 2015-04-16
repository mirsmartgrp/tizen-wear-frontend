function message(id, data)
{
	console.log(id);
	console.log(data);
}

$(window).load(function()
{
	$("#start").click(startingApp);
	$("#stop").click(stoppingApp);
	document.addEventListener('tizenhwkey', function(e)
	{
		if (e.keyName == "back")
		{
			tizen.application.getCurrentApplication().exit();
		}
	});

	try
	{
		addReceiveListener(message);
		removeReceiveListener(message);
	}
	catch (e)
	{
		console.log(e);
	}
	$('.contents').on("click", function()
	{
		$('#textbox').html($('#textbox').html() == "Basic" ? "Sample" : "Basic");
		connect();
		console.log("Try connecting")
	});

});

function startingApp()
{
	try
	{
		startDataCollector();
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
		saveAsJSON();
		stopDataCollector();
	}
	catch (e)
	{
		console.log(e);
	}
}