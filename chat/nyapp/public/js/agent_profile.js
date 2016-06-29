jQuery(function($){
	var socket = io.connect("http://localhost:8080");
	socket.on('connect', function (socket) {
		console.log('Connected!');
	});

	$name = $("#name");
	$pass = $('#password');
	$confirm = $('#confirm');
	$email = $("#email");
	$button = $('#ok-button');

	socket.on('details',function(data,data1){
		console.log("recieved here");
		$name.val(data);
		$email.val(data1);
	});

	$button.click(function(e){
		e.preventDefault();
		console.log($name.val());
		if($pass.val()===$confirm.val()&&$name.val()!==""&&$pass.val()!==""&&$confirm.val()!==""&&$email.val()!==""){
			var http = new XMLHttpRequest();
			var url = "/updation";
			var a={
				v1:$name.val(),
				v2:$pass.val(),
				v3:$email.val()
			}
			console.log(a);
			var params = JSON.stringify(a);
			http.open("POST", url , true);
			http.setRequestHeader("Content-type", "application/json");
			http.onreadystatechange = function() {
				if(http.readyState == 4 && http.status == 200) 
				{
					console.log("in here here here");
					tester = JSON.parse(http.responseText);
					//socket.emit('change_agentpage',$name.val());
					if(tester==="ho gaya")
						alert("Your details have been updated!!")
				}
			}
			console.log(params);
			http.send(params);
		}
		else{
			alert("Either any field is null or the passwords donot match");
		}
	})
})