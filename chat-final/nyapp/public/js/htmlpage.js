jQuery(function($){

	var socket = io.connect("http://localhost:8080");
	socket.on('connect', function (socket) {
    console.log('Connected!');
	});
	console.log("yere");
	
	socket.on('s_to_ag',function(data,data1)
	{
		console.log("i m here prem");
		console.log(data);
		console.log(data1);
		var p=$("<div></div>").text(data);
		$("#ap").append(p);

	});

	function height(){
		var body_height=$("#body1").height()
		console.log($("#body1").height());
		data={
			page_id:"#body1",
			h:body_height
		}
		console.log(data);
		socket.emit('check_height',data);
	}
	height();


});