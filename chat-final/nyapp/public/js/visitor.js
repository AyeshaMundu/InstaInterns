var i=2;
var b;
var curragent;
var tester;
var con_ip="localhost";
var port_no="3000";
jQuery(function($)
{

	var newmessage = document.createElement('audio');
	newmessage.setAttribute('src', '/audio/new-message.mp3');
	newmessage.autoplay=false;
	newmessage.load();
	var $q=$("#qu");
	$q.hide();
	$("#submitted").hide();
	function send()
	{
		var n=document.getElementById("enter-msg").value;
		console.log(n);
		var p=$("<div></div>").text(n);
		p.addClass("chat-bubble");
		p.attr("id","me");
		$("#chat-bubbles").append(p);
		socket.emit('vmsg',n,$("#cb-panel-body").text(),$("#enter-name").val());
		var myDiv = document.getElementById("parent");
		console.log(myDiv);
		myDiv.scrollTop = myDiv.scrollHeight;
		document.getElementById("enter-msg").value="";
		var http = new XMLHttpRequest();
		var url = "/vchat_add";
		var a={

			v1:b,
			v2:curragent,
			v3:n
		}
		console.log(a);
		var params = JSON.stringify(a);

		http.open("POST", url , true);


		http.setRequestHeader("Content-type", "application/json");
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) 
			{
				console.log("in here here here");

				 tester = JSON.parse( http.responseText );
			}
		}

		http.send(params);
	}

	$('#typing').hide();
	var $enter_msg=$(".chat-enter");
	var $msg=$("#enter-msg");
	$enter_msg.hide();
	var $parent=$(".parent");
	var $iframe=$(".iframe_win");
	var $query=$("#enter-query");
	$parent.hide();


	var socket = io.connect("http://"+con_ip+":8080");
	socket.on('connect', function (socket) {
    console.log('Connected!');
	});

	//console.log("no no be");
	$("#cb-window1").hide();
	$("#cb-panel1").click(function(){
		$("#cb-window1").slideToggle(600);
	});

	$("#closeb1").click(function()
	{
		console.log($("#cb-panel-body").text());
		console.log(document.getElementById("enter-name").value);
		socket.emit('visitor_disconnect1',$("#cb-panel-body").text(),$("#enter-name").val());
		$(".chat-box").remove();
	});

	$("#ok-button").click(function (e)
	{
       
        e.preventDefault();
        welcome();

	});

	socket.on('typing_to_v',function(data,data1)
	{
		console.log("typing wala event");
		console.log(data);
		console.log(data1);
		$("#typing").show();
	});

	
	$("#enter-email").on("keydown",function(event)
	{
		if(event.which==13)
		{
			welcome();
		}
	});

	$("#submit-query").click(function(){
		queryinsert();
		$('#all').hide();
		$("#submitted").show();
	})

	$("#sendmsg").click(function(e)
	{
		e.preventDefault();
		console.log("send called");
		send();
	});


	$("#enter-msg").on("keydown",function(event)
	{

		
		if(event.which==13)
		{
			console.log("send called");
			send();
		}
		else
		socket.emit("vtyping",$("#cb-panel-body").text(),$("#enter-name").val());	

	});

	function queryinsert(){
		var que=document.getElementById("enter-query").value;
		var mail=document.getElementById("enter-email").value;
		var http = new XMLHttpRequest();
		var url = "/visitor-query";
		var a={
			v1:mail,
			v2:que
		}
		console.log(a);
		var params = JSON.stringify(a);
		http.open("POST", url , true);
		http.setRequestHeader("Content-type", "application/json");
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) 
			{
				console.log("in here here here");
				tester = JSON.parse( http.responseText );
			}
		}
		console.log(params);
		http.send(params);
	}

	function welcome(){
		var m=document.getElementsByClassName("chatwindow-container");
		console.log(m);
		//m[0].style.visibility="hidden";
		console.log($enter_msg);
		b=document.getElementById("enter-name").value;
		c=document.getElementById("enter-email").value;
        console.log("yahan bhai");
		var http = new XMLHttpRequest();
		var url = "/visitor";
		var a={

			v1:b,
			v2:c
			
		}
		console.log(a);
		var params = JSON.stringify(a);

		http.open("POST", url , true);


		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {

				console.log("in here");
				console.log(http.responseText);
				tester = JSON.parse( http.responseText );
				if(tester!=0)
				{
					m[0].style.visibility="hidden";
					//$enter_msg.show();
					$parent.show();
					b=document.getElementById("enter-name").value;
					c=document.getElementById("enter-email").value;
					console.log(tester[0].agent_nick+" is eligible");
					curragent=tester[0].agent_nick;
					document.getElementById("cb-panel-body").innerHTML=curragent;
					var data={
						v1:tester[0].agent_nick,
						v2:b,
						v3:c
					}
					socket.emit('new_visitor',data);

				}
				else
				{
					$("#ok-button").hide();
					$("#submit-query").show();
					$(".chatwindow-container").css("max-height","90%");
					var $q=$("#qu");
					$q.show();
					console.log("all agents are busy");
				}

			}
		}
		console.log(params);
		http.send(params);

	}

	socket.on('ag_to_s',function(data,data1)
	{
		$("#typing").hide();
		console.log("msg aa gya");
		newmessage.play();
		console.log(data);
		console.log(data1);
		var p=$("<div></div>").text(data);
		p.addClass("chat-bubble");
		p.attr("id","you");
		$("#chat-bubbles").append(p);
		var myDiv = document.getElementById("parent");
		console.log(myDiv);
		myDiv.scrollTop = myDiv.scrollHeight;

	});

	socket.on('agent_disconnect',function(data,data1)
	{
		console.log("inside disconnect");
		console.log(data);
		console.log(data1);
		if(data===$("#cb-panel-body").text())
		{
			var p=$("<div></div>").text(data+" is offline now, try reconnecting");
			p.addClass("chat-bubble");
			p.css("background-color","#efeed4");
			$("#chat-bubbles").append(p);
			$($enter_msg).hide();
			
		}

	});

	socket.on('arc_clk',function(data)
	{
		$enter_msg.show();
	});

});