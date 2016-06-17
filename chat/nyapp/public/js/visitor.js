var i=2;
var b;
var curragent;
var tester;
jQuery(function($)
{
	function send()
	{
		var n=document.getElementById("enter-msg").value;
		console.log(n);
		var p=$("<div></div>").text(n);
		p.addClass("chat-bubble");
		p.attr("id","me");
		$("#chat-bubbles").append(p);
		socket.emit('vmsg',n,$("#cb-panel-body").text(),$("#enter-name").val());
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
	var $iframe=$("iframe_win");
	$parent.hide();


	var socket = io.connect("http://localhost:8080");
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

	
	$("#enter-name").on("keydown",function(event)
	{
		if(event.which==13)
		{
			welcome();
		}

	});	

	$("#sendmsg").click(function(e)
	{
		e.preventDefault();
		send();
	});


	$("#enter-msg").on("keydown",function(event)
	{

		
		if(event.which==13)
		{
			send();
		}
		else
		socket.emit("vtyping",$("#cb-panel-body").text(),$("#enter-name").val());	

	});

	function welcome(){
		var m=document.getElementsByClassName("chatwindow-container");
		console.log(m);
		m[0].style.visibility="hidden";
		console.log($enter_msg);
		$enter_msg.show();
		$parent.show();
        console.log("yahan bhai");
		var http = new XMLHttpRequest();
		var url = "/visitor";
		var a={

			v1:"new-visitor"

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
					b=document.getElementById("enter-name").value;
					console.log(tester[0].agent_nick+" is eligible");
					curragent=tester[0].agent_nick;
					document.getElementById("cb-panel-body").innerHTML=curragent;
					var data={
						v1:tester[0].agent_nick,
						v2:b
					}
					socket.emit('new_visitor',data);

				}
				else
				{

					console.log("all agents are busy");
					var p=$("<div></div>").text("all ours agents are buzy we will contact you soon");
					p.addClass("chat-bubble");
					p.css("background-color","#efeed4");
					$("#chat-bubbles").append(p);
					$($enter_msg).hide();
					//socket.emit('new_visitor',"hehehe");
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
		console.log(data);
		console.log(data1);
		var p=$("<div></div>").text(data);
		p.addClass("chat-bubble");
		p.attr("id","you");
		$("#chat-bubbles").append(p);

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

});