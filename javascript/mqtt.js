/********************************************MQTT工具类开始 ******************************************/

GhostWu.LORA_MQTT = GW.L_MQTT = {

	setting : {
		server 					: GW.L_CFG.MQTT_SERVER,
		username 				: '',
		userpwd 				: '',
		useSSL					: false,
		cleanSession				: false,
		timeout					: 5000,
		keepAliveInterval 			: 20,
		reconnect 				: true
	},
	args : {},
	instance : null,
	init : function( opt ){
		var opts = mui.extend( {}, this.setting, opt );
		console.log( 'GW.L_MQTT extends:' + JSON.stringify( opts ) );
		this.args = opts;
		this.connect( opts );
	},
	connect : function( _opts ){
		this.instance = new Paho.MQTT.Client( _opts.server, Number(8083), _opts.username );
		
		this.instance.connect({
			onSuccess : this.onConnect,
			userName : _opts.username,
			password : _opts.userpwd,
			cleanSession : _opts.cleanSession,
			keepAliveInterval : _opts.keepAliveInterval,
			onFailure : function( errorCode ){					
			}	
		});
		this.instance.onMessageArrived = GW.L_MQTT.onMessageArrived;
		this.instance.onConnectionLost = GW.L_MQTT.onConnectionLost;
		this.instance.onMessageDelivered = GW.L_MQTT.onMessageDelivered;		
	},
	onConnect : function(){
		console.log( "mqtt server connected>>>>>>>>>>>>>>>>>>>>>>" );
		plus.nativeUI.closeWaiting(); //关闭重连提示窗口
		GW.L_MQTT.instance.subscribe( "xxxxxx" + GW.L_MQTT.args['username'], {
			qos : 2,
			onSuccess : function( sub_success ){
			},
			onFailure : function( sub_error ){
			}
		} );
	},
	onConnectionLost : function( responseObject ) {
        if ( responseObject.errorCode !== 0 ) {
	        console.log( "onConnectionLost:"+responseObject.errorMessage );
	        console.log( GW.H.L( "appJs_MqttLostConnect" ) );
//	        mui.toast( GW.H.L( "appJs_MqttLostConnect" ) );
	    }
    },
	onMessageArrived : function( message ){
		var topic = message.destinationName;
		var payload = message.payloadString;
		console.log("响应函数执行----->收到消息:"+message.payloadString);
		var oLog = GW.L_LOG_SYSTEM.parseCommand( 'lora_recv_message_log', payload );
	    GW.L_LOG_SYSTEM.cacheLog( "lora_recv_message_log", oLog );
		GW.L_MQTT.messageCallback( topic, payload );
	},
    messageCallback : function( topic, payload ){
    	//预留处理推送信息
    },
    sendMessage : function( topic, _message ) {
    	var me = this;
	    var message = new Paho.MQTT.Message( _message );
	    message.destinationName = topic;
	    message.qos = 2;
	    var oLog = GW.L_LOG_SYSTEM.parseCommand( 'lora_send_message_log', _message );
	    console.log( 'parseSendLog:' + JSON.stringify( oLog ) );
	    GW.L_LOG_SYSTEM.cacheLog( "lora_send_message_log", oLog );
	    this.instance.send( message );
//	    try {
//	    	this.instance.send( message );
//	    }catch( err ){
//	    	console.log( 'try---->catch' + err );
//	    	plus.nativeUI.closeWaiting();
//			plus.nativeUI.showWaiting( GW.H.L( "appJs_MqttReconnect" ) );
//	    	GW.L_MQTT.connectByLocalInfo();
//			mui.toast( GW.H.L( "appJs_MqttLostConnect" ) );
//	    }
	},
	onMessageDelivered : function( message ){
		console.log( "当前topic已经发送:" + message.destinationName );
		console.log( "当前payloadString已经发送:" + message.payloadString );
	},
	checkConnectStatus : function(){
		var lora_mqtt = JSON.parse( localStorage.getItem('bG9yYV9tcXR0') );
		var mq_username = ( "dXNlcm5hbWU=" in lora_mqtt ) && GW.L_UTILS.decode( lora_mqtt['dXNlcm5hbWU='] ) || "";
		var mq_userpwd = ( "cGFzc3dvcmQ=" in lora_mqtt ) && GW.L_UTILS.decode( lora_mqtt['cGFzc3dvcmQ='] ) || "";
		if( mq_username == "" || mq_userpwd == "" ) { 
			mui.toast( GW.H.L( "appJs_MqttAccountNull" ) );
			return;
		}		
		if( !GW.L_MQTT.instance ){
			mui.toast( GW.H.L( "appJs_MqttInstanceNull" ) );  			
			return;
		}
	}
};

/********************************************MQTT工具类结束 ******************************************/
