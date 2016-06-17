var i=1;
var us;
var vis_name;
var tctr=0;
var tester;
jQuery(function($){

	$(window).on('beforeunload', function()
	{

		var off1=document.getElementById("key");

		var http = new XMLHttpRequest();
		var url = "/agent_close";
		var a={

			v1:off1.innerHTML,


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

		return 'Are you sure you want to leave?';


	});


	var offf=document.getElementById("key");
	var user_ctr=0;
	var socket = io.connect("http://localhost:8080");
	socket.on('connect', function (socket) 
	{
    console.log('Connected!');
	});

	socket.emit("new_user",offf.innerHTML);


	socket.on('catchit',function(data,data1){
		var off1=document.getElementById("key");
		if(data===off1.innerHTML)
		{
			//alert(data);
			user_ctr++;
			console.log("inside catchit");
			console.log(data);
			console.log(data1);
			us=data1;
			$(".arc").show();
			$(".new-chat-no").text("1");
		}
	});


    $("#logoutmsg").hide();
    $("#offline").click(function (e)
    {
    	e.preventDefault();
    	var off=document.getElementById("off");
    	var off1=document.getElementById("key");
    	console.log(off);
    	if(off.innerHTML==="Go Offline")
    	{
    		var http = new XMLHttpRequest();
    		var url = "/offline";
    		var a={

    			v1:off1.innerHTML,


    		}
    		console.log(a);
    		var params = JSON.stringify(a);

    		http.open("POST", url , true);

    		http.setRequestHeader("Content-type", "application/json");

    		http.onreadystatechange = function() {
    			if(http.readyState == 4 && http.status == 200) {

    				console.log("in here here here");
    				console.log(http.responseText);
    				tester = JSON.parse( http.responseText );
    				console.log(tester);
    				if(tester.length>0)
    					alert("you cant go offline now");
    				else
    				{
    					off.innerHTML="";
    					off.innerHTML="Go Online";
    					$("#logoutmsg").show();
    				}



    			}
    		}
    		console.log(params);
    		http.send(params);
    		console.log("hello nandu nandu");

    	}
    	else
    	{

    		$("#logoutmsg").hide();
    		off.innerHTML="";
    		off.innerHTML="Go Offline";
    		var http = new XMLHttpRequest();
    		var url = "/online";
    		var a={

    			v1:off1.innerHTML,


    		}
    		console.log(a);
    		var params = JSON.stringify(a);

    		http.open("POST", url , true);


    		http.setRequestHeader("Content-type", "application/json");

    		http.onreadystatechange = function() {
    			if(http.readyState == 4 && http.status == 200) {

    				console.log("in here here here");
    				console.log(http.responseText);



    			}
    		}
    		console.log(params);
    		http.send(params);
    		console.log("hello nandu nandu");

    	}

    });
	$("#cb-panel1").click(function(){
		$("#cb-window1").slideToggle(600);
	});

	$(".arc").hide();

	$("#closeb1").click(function(){
		$("#col1").remove();
	});
	
	$(".arc").click(function()
	{
		$(".arc").hide();
		$(".default-li").hide();

		var off1=document.getElementById("key");
		console.log("key value is "+off1.innerHTML);
		
		var http = new XMLHttpRequest();
		var url = "/agent_pick";
		var a={

			v1:off1.innerHTML,


		}
		console.log(a);
		var params = JSON.stringify(a);

		http.open("POST", url , true);

		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) 
			{
				console.log("in here here here");
				console.log(http.responseText);

				tester = JSON.parse( http.responseText );
			}
		}




		http.send(params);


		var ictr=0;
		var ctr=parseInt($(".arc").text());
		console.log(ctr);
		for(var j=1;j<=1;j++)
		{
			var new_in_list=$("<li></li>").attr('id',j);
			new_in_list.addClass("new_li");
			var new_a_tag=$("<a></a>").attr('href',"#");
			new_a_tag.text("visitor "+j);
			$(new_in_list).append(new_a_tag);
			$("#up-list-dropup").append(new_in_list);

			var new_col= $("<div></div>").addClass("col-md-3");
			var new_chatbox=$("<div></div>").addClass("chat-box");
			var new_chatbox_panel=$("<div></div>").addClass("chatbox-panel");
			var new_chatbox_panel_body=$("<span></span>").addClass("chatbox-panel-body");
			var new_chat_icon=$("<span></span>").addClass("glyphicon glyphicon-comment");
			var new_close_button=$("<button></button>").addClass("close");
			var new_closeicon=$("<span></span>").attr('aria-hidden',"true");
			var new_chatwindow=$("<div></div>").addClass("chatbox-window");
			var iframe_parent=$("<div></div>").addClass("parent");
			var iframe=$("<div></div>").addClass('iframe_win');
			var p=$("<div></div>").addClass("chat-bubble");
			var chat_enter=$("<div></div>").addClass("chat-enter");
			var enter_msg=$("<textarea></textarea>").attr('id',"enter-msg"+i);
			var send_gly=$("<span></span>").addClass("glyphicon glyphicon-send");
			var type=$("<div></div>").addClass("typebubbles");
			var typing=$("<div></div>").addClass("chat-bubble");
			var gif=$("<img>").attr("src","/img/typing.gif");
			typing.attr('id','you');
			typing.attr('style','border: 1px solid #e6e6e6; padding:10px 5px;');
			gif.attr("width",'46');
			$(type).append(typing);
			$(typing).append(gif);


			p.attr('id','me');
			send_gly.attr('id',"msg");
			enter_msg.attr('type',"text");
			enter_msg.addClass("enter-msg");
			new_chatbox_panel.attr('id','cb-'+i);
			new_chatwindow.attr('id','cb-'+i+'-window');
			new_chat_icon.addClass("chat-icon");
			new_closeicon.html("&times;");
			new_chatbox_panel_body.text(us);
			iframe.attr("id","if-"+i);
			iframe.attr("src",us);
			new_close_button.attr('type',"button");
			new_close_button.attr('id',"closeb"+i);
			new_col.attr('id','col'+i);
			p.text("Thank you for contacting InstaReM, how may I help you?");
			i++;

			$(iframe).append(p);
			$(iframe_parent).append(iframe);
			$(new_chatwindow).append(iframe_parent);
			$(chat_enter).append(enter_msg);
			$(chat_enter).append(send_gly);
			$(new_chatwindow).append(chat_enter);
			$(new_close_button).append(new_closeicon);
			$(new_chatbox_panel).append(new_chatbox_panel_body);
			$(new_chatbox_panel).append(new_chat_icon);
			$(new_chatbox_panel).append(new_close_button);
			$(new_chatbox).append(new_chatbox_panel);
			$(new_chatbox).append(new_chatwindow);
			$(new_col).append(new_chatbox);
			$(new_col).insertAfter("#settings-button");
			$(new_chatwindow).hide();
			if(ictr>=3)
			$(new_col).hide();
			$(new_chatbox_panel).click(function(){
				$("#"+$(this).attr('id')+"-window").slideToggle(600);
			});

			$(new_close_button).click(function(){
			var check=$(this).attr('id');
			check=check[check.length-1];
			$("#col"+check).hide();
			ictr--;
			console.log(ictr);
			});

			function send(no){
				console.log("click");
				var message=$(enter_msg);
				var n=message.val();
				console.log(n);
				var off1=document.getElementById("key");
				console.log(off1.innerHTML);
				socket.emit('amsg',$(enter_msg).val(),$(new_chatbox_panel_body).text());
				var p=$("<div></div>").text($(enter_msg).val());
				p.addClass("chat-bubble");
				p.attr("id","me");
				$("#if-"+no).append(p);
				var http = new XMLHttpRequest();
				var url = "/achat_add";
				var a={

					v1:us,
					v2:off1.innerHTML,
					v3:$(enter_msg).val()
				}
				//message.value="";
				$(enter_msg).val("");
				console.log(a);
				var params = JSON.stringify(a);

				http.open("POST", url , true);


				
				http.setRequestHeader("Content-type", "application/json");

				http.onreadystatechange = function() {
					if(http.readyState == 4 && http.status == 200) 
					{
						console.log("in here here here");
						console.log(http.responseText);

						tester = JSON.parse( http.responseText );
					}
				}



				http.send(params);


			}

			$(send_gly).click(function(e)
			{

				e.preventDefault();
				var v=$(enter_msg).attr("id");
				var no=v[v.length-1];
				send(no);

			});

			$(enter_msg).on("keydown",function(event)
			{

				if(event.which==13)
				{
					var v=$(enter_msg).attr("id");
					var no=v[v.length-1];
					send(no);
				}
				else
				socket.emit('atyping',$(enter_msg).val(),$(new_chatbox_panel_body).text());

			});


	
			$(new_in_list).click(function(){
				$("#col"+$(this).attr('id')).toggle();
				var check="#col"+$(this).attr('id');
				check=$(check).css('display');
				if (check==="block") {
					ictr++;
					console.log(ictr);
				}
				else{
					ictr--;
					console.log(ictr);
				}
				if(ictr>ctr)
				{
					var check2="#col"+$(this).attr('id');
					console.log(check2);
					console.log("omg");
					if((check2!=="#col5")&&(check2!=="#col4")){
						if(($("#col5").css('display'))=="block")
						{
							$("#col5").hide();
							$("#col4").hide();
							$(check2).show();
						}
						else if(($("#col4").css('display'))=="block"){
							$("#col5").hide();
							$("#col4").hide();
							$(check2).show();

						}
					}
				}
			});
			ictr++;
		}

		socket.on('s_to_ag',function(data,data1,data2)
		{
			tctr=0;
			$(".typebubbles").remove();
			console.log("msg aa gya");
			console.log(data);
			console.log(data1);
			var p=$("<div></div>").text(data);
			p.addClass("chat-bubble");
			p.attr("id","you");
			console.log("check krne ka chiz "+data2);
			console.log("panel ka cheez");
			console.log($(iframe).attr("id"));
			if($(iframe).attr("src")===data2)
			{
				$(iframe).append(p);
				console.log("match");
			}
		});

		socket.on('typing_to_ag',function(data,data1)
		{
			console.log("typing wala event");
			console.log(data);
			console.log(data1);
			if($(iframe).attr("src")===data1)
			{
				console.log("match");
				if(tctr===0){
					$(iframe).append(type);
					tctr++;
				}
			}
		});

		socket.on('visitor_disconnect',function(data,data1)
		{
			var off1=document.getElementById("key");
			console.log("inside disconnect");
			console.log(data);
			console.log(data1);
			if(data===off1.innerHTML)
			{
				if($(iframe).attr("src")===data1)
				{
					var p=$("<div></div>").text(data1+" has disconnected click to close this window");
					p.addClass("chat-bubble");
					p.css("background-color","#efeed4");
					p.css("cursor","pointer");
					p.on("click",function(){
						$(new_col).remove();
						$(new_in_list).remove();
					})
					$(iframe).append(p);
					$(enter_msg).hide();
				}
				console.log("visitor has disconnected");
				var http = new XMLHttpRequest();
				var url = "/slot_decrease";
				var a={

					v1:off1.innerHTML,

				}
				console.log(a);
				var params = JSON.stringify(a);

				http.open("POST", url , true);

				http.setRequestHeader("Content-type", "application/json");
				http.onreadystatechange = function() 
				{
					if(http.readyState == 4 && http.status == 200) 
					{

						tester = JSON.parse( http.responseText );
						console.log("slot decrease");
					}
				}


				console.log(params);
				http.send(params);
			}
		});



	});
$("#logout").click(function (e)
{
	e.preventDefault();
	console.log("inside");
	var off1=document.getElementById("key");
	console.log(off1.innerHTML);

	var http = new XMLHttpRequest();
	var url = "/log_out";
	var a={

		v1:off1.innerHTML,


		}
		console.log(a);
		var params = JSON.stringify(a);

		http.open("POST", url , true);

		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {

				console.log("in here here");
				console.log(http.responseText);
				tester = JSON.parse( http.responseText );
				if(tester.length===0)
				{
					location="http://localhost:3000/login";
				}
				
				else
				{
					alert("you cannot logout now");
				}

			}
		}
		console.log(params);
		http.send(params);
		console.log("hello nandu");
	});



	

});


		
        
      






