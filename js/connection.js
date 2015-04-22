var connection = (function(){
	var my ={};
	
	var SAAgent;
	var receiveCallbacks = [];
	var popupCheck = false;
	
	my.popupCheck = popupCheck;
	
	/**
	 * Add a callback function to the listerner list. Callback is invoked when a message is received.
	 * @param callback the callback function which should be added to the listener list.
	 */
	my.addReceiveListener = function(callback)
	{
		receiveCallbacks[receiveCallbacks.length]= callback;
	}
	
	/**
	 * Removes callback from list of listerns.
	 * @param callback function that should be removed from listener list
	 */
	my.removeReceiveListener =function(callback)
	{
		for(var i = 0;i<receiveCallbacks.length;i++){
			if(receiveCallbacks[i] == callback){
				receiveCallbacks.splice($.inArray(callback, receiveCallbacks),1);
			}
		}
	}
	
	/**
	 * Callback for receiving messages. Informs listeners
	 * @param id
	 * @param data received data
	 */
	my.onReceive = function(id, data)
	{
		for(var i = 0;i<receiveCallbacks.length;i++){
			receiveCallbacks[i](id,data);
		}
	}
	
	/**
	 * Send data to phone if phone is connected
	 * @param data String which should be send to the connected phone
	 */
	my.sendData = function(data)
	{
		var channelID = 104;
		try
		{
			SASocket.sendData(channelID, data);
		}
		catch (e)
		{
			console.log(e);
		}
	}
	return my;
}($));
	
	
	/*
	*********************************************************************************
	*																				*
	*                 	Samsung Connetion methods									*
	*       		          DO NOT MODIFY !!!										*
	*                 																*
	*********************************************************************************
	*/
	/**
	 * Callback for handle exceptions
	 * @param error
	 */
	function onError(error)
	{
		console.log(error);
		if(popupCheck == false)
		{
			tau.openPopup("#ErrorPopup");
		}
	}
	
	/**
	 * Callback when a connection could be established
	 * @param agents
	 */
	function onSuccess(agents)
	{
		SAAgent = agents[0];
		for ( var i = 0; i < agents.length; i++)
		{
			console.log(i + ": " + agents[i].name);
		}
		SAAgent.setServiceConnectionListener(connectioncallback);
		SAAgent.setPeerAgentFindListener(peeragentfindcallback);
		connect();	
	}
	
	/**
	 * Callback when status changed
	 * @param type
	 * @param status
	 */
	function ondevicestatus(type, status)
	{
		if (status == "ATTACHED")
		{
			console.log("Attached remote peer device. : " + type);
			SAAgent.findPeerAgents();
		}
		else if (status == "DETACHED")
		{
			console.log("Detached remote peer device. : " + type);
			tau.openPopup("#ErrorPopup");
			SASocket = undefined;
		}
	}
	
	var SASocket;
	var connectioncallback = {
		/* Remote peer agent requests a service connection */
		onrequest : function(peerAgent)
		{
			if (peerAgent.appName == "ConnectionHandlerTizen")
			{
				SAAgent.acceptServiceConnectionRequest(peerAgent);
			}
			else
			{
				SAAgent.rejectServiceConnectionRequest(peerAgent);
			}
		},
		onrequest : function(peerAgent)
		{
			if (typeof (SAAgent.authenticatePeerAgent) === 'function')
			{
				SAAgent.authenticatePeerAgent(peerAgent, function(peerAgent, authToken)
				{
					/* Authentication token of peer agent arrives */
					if (authToken.key == "expected key string (BASE64)")
					{
						SAAgent.acceptServiceConnectionRequest(peerAgent);
					}
					else
					{
						SAAgent.rejectServiceConnectionRequest(peerAgent);
					}
				}, function(e)
				{
					/* Error handling */
					SAAgent.rejectServiceConnectionRequest(peerAgent);
				});
			}
			else
			{
				if (peerAgent.appName === "ConnectionHandlerTizen")
				{
					SAAgent.acceptServiceConnectionRequest(peerAgent);
				}
				else
				{
					SAAgent.rejectServiceConnectionRequest(peerAgent);
				}
			}
		},
		/* Connection between provider and consumer is established */
		onconnect : function(socket)
		{
			SASocket = socket;
			try
			{
				socket.setDataReceiveListener(connection.onReceive);
				tau.closePopup("#ErrorPopup");
			}
			catch (e)
			{
				console.log(e);
			}
		}
	}
	
	
	/**
	 * Callback when a new connection is found in findPeerAgents method
	 * @param peerAgent
	 */
	function onpeeragentfound(peerAgent)
	{
		console.log("PEER FOUND!");
		if(SASocket != undefined)
		{
			tau.closePopup("#ErrorPopup");
		}
		else if (peerAgent.appName == "ConnectionHandlerTizen")
		{
			SAAgent.requestServiceConnection(peerAgent);
	
		}
	}
	
	/**
	 * Callback which is called when the status of the connected phone changes in findPeerAgents
	 * @param peerAgent
	 * @param status
	 */
	function onpeeragentupdated(peerAgent, status)
	{
	
		if (status == "AVAILABLE")
		{
			console.log("PEER AVAILABLE!")
			SAAgent.requestServiceConnection(peerAgent);
		}
		else if (status == "UNAVAILABLE")
		{
			console.log("Uninstalled application package of peerAgent on remote device.");
		}
	}
	
	var peeragentfindcallback = {
		onpeeragentfound : onpeeragentfound,
		onpeeragentupdated : onpeeragentupdated,
		onerror : onError
	};
	
	try
	{
		webapis.sa.requestSAAgent(onSuccess, onError);
		webapis.sa.setDeviceStatusListener(ondevicestatus);
	
	}
	catch (err)
	{
		console.log(err);
	}
	
	
	/**
	 * Try to connect to phone if no connection available
	 */
	function connect()
	{
		if (SAAgent != undefined)
		{
			try
			{
				SAAgent.findPeerAgents();
	
			}
			catch (err)
			{
				console.log(err);
			}
		}
		else
		{
			console.log("SAAgent undefined!");
		}
	}