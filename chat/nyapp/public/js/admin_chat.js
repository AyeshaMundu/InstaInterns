jQuery(function($){
	var http = new XMLHttpRequest();
	var url = "/chats";
	var a={
		v1:"hello"
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
			for(var i=0;i<tester.length;i++){
				if(tester[i].user_message!=null){
					console.log(tester[i].user_nick+" : "+tester[i].user_message);
				}
				else{
					console.log(tester[i].agent_nick+" : "+tester[i].agent_message);
				}
			}
		}
	}
	console.log(params);
	http.send(params);
})