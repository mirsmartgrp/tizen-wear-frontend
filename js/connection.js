var SAAgent;

function onReceive(id,data)
{
	console.log(data);
	sendData("Received Message!");
}

function onError(error)
{
	console.log(error);
}

function onSuccess(agents)
{
	SAAgent = agents[0];
	for ( var i = 0; i < agents.length; i++)
	{
		console.log(i + ": " + agents[i].name);
	}
	SAAgent.setServiceConnectionListener(connectioncallback);
	SAAgent.setPeerAgentFindListener(peeragentfindcallback);

}

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
	}
}

var SASocket;
var connectioncallback = {
	/* Remote peer agent requests a service connection */
	onrequest : function(peerAgent)
	{
		if (peerAgent.appName == "BackenSenderTizen")
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
			SAAgent.authenticatePeerAgent(peerAgent, function(peerAgent,
					authToken)
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
			if (peerAgent.appName === "BackenSenderTizen")
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
		try{
		socket.setDataReceiveListener(onReceive);
		}catch(e){
			console.log(e);
		}
	}
}




function onpeeragentfound(peerAgent)
{
	console.log("PEER FOUND!");
	if (peerAgent.appName == "BackenSenderTizen")
	{
		SAAgent.requestServiceConnection(peerAgent);

	}
}

function onpeeragentupdated(peerAgent, status)
{

	if (status == "AVAILABLE")
	{
		console.log("PEER AVAILABLE!")
		SAAgent.requestServiceConnection(peerAgent);
		console.log("ADD Recive Listener!");
		try
		{
			addReciveListener(function(data)
			{
				console.log("DATA collected!");
				console.log(data);
			});
		}
		catch (e)
		{
			console.log(e);
		}
	}
	else if (status == "UNAVAILABLE")
	{
		console
				.log("Uninstalled application package of peerAgent on remote device.");
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



function sendData(data)
{
	var channelID = 104;
	try{
	SASocket.sendData(channelID, data);
	}catch(e){
		console.log(e);
	}
}

function addReciveListener(callback)
{
	SASocket.setDataReciveListener(callback);
}
