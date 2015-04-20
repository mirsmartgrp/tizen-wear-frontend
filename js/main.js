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
		}
		catch (e)
		{
			console.log(e);
		}
	
		$("#ErrorPopup").bind({popupshow: function(){popupCheck = true;}, popuphide:  function(){popupCheck = false;}});
		
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
		sendToPhone();
		stopDataCollector();
	}
	catch (e)
	{
		console.log(e);
	}
}