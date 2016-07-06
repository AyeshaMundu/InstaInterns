var agctr;
var con_ip="localhost";
var port_no="3000";
jQuery(function($){

	$("#loading-gif").hide();
	$("#side-menu-bar").height($(window).height());
	$("#left-chev").on("click",function(){
		$(".online-agents-container").css("animation","online-agents-container 1s");
		$(".online-agents-container").css("right","0px");
	})
	$("#right-chev").on("click",function(){
		$(".online-agents-container").css("animation","online-agents-reverse 1s");
		$(".online-agents-container").css("right","-250px");
	})

	$(".chat-list-a").on("click",function(){
		$("#all-chat-list").hide();
		console.log("click121");
	});

	$(".rmv-agent-form").hide();
	$(".remove-agent-form").hide();
	$("#add-agent-button").click(function(){
		$(".rmv-agent-form").slideToggle(200);
		$(".remove-agent-form").hide();
	});

	$("#rmv-agent-button").click(function(){
		$(".remove-agent-form").slideToggle(200);
		$(".rmv-agent-form").hide();
	});

	var adname,admail;
	var socket = io.connect("http://"+con_ip+":8080");
	socket.on('connect', function (socket) {
		console.log('Connected!');
	});
	var name = "admin";
	socket.emit("new_user",name);

	var http1 = new XMLHttpRequest();
	var url1 = "/admin_name&email";
	var a1={
		v1:"hello"
	}
	console.log(a1);
	var params1 = JSON.stringify(a1);
	http1.open("POST", url1 , true);
	http1.setRequestHeader("Content-type", "application/json");
	http1.onreadystatechange = function(){
		if(http1.readyState == 4 && http1.status == 200){
			console.log("in here here here");
			tester = JSON.parse(http1.responseText);
			console.log(tester);
			console.log(tester[0].agent_nick);
			console.log(tester[0].email);
			adname = tester[0].agent_nick;
			admail = tester[0].email;
		}
	}
	console.log(params1);
	http1.send(params1);	

	$("#add-button").on("click",function(){
		var agent_nick=$("#new-agent-ninp").val();
		var agent_email=$("#new-agent-einp").val();
		console.log(agent_nick);
		console.log(agent_email);
		var http1 = new XMLHttpRequest();
		var url1 = "/add_agent";
		var a1={
			nick:agent_nick,
			email:agent_email
		}
		console.log(a1);
		var params1 = JSON.stringify(a1);
		http1.open("POST", url1 , true);
		http1.setRequestHeader("Content-type", "application/json");
		http1.onreadystatechange = function(){
			if(http1.readyState == 4 && http1.status == 200){
				var newli=$("<li></li>").attr("id","li"+agent_nick);
				var newsp=$("<img>").addClass("agent-mgmt-avatar");
				newsp.attr("src","/uploads/avatar.png");
				var newa=$("<a></a>").text(agent_nick);
				newa.attr("href","#");
				$(newli).append(newsp);
				$(newli).append(newa);
				$("#agent-mgmt-list").append(newli);
			}
		}
		console.log(params1);
		http1.send(params1);
		$("#new-agent-ninp").val("");
		$("#new-agent-einp").val("");
	});

	var http7 = new XMLHttpRequest();
	var url7 = "/get_list";
	http7.open("GET", url7 , true);
	http7.setRequestHeader("Content-type", "application/json");
	http7.onreadystatechange = function(){
		if(http7.readyState == 4 && http7.status == 200){
			console.log("in here here here");
			tester = JSON.parse(http7.responseText);
			console.log("length of list is "+tester.length);
			agctr=tester.length;
			for(var i=0;i<tester.length;i++)
			{
				console.log(tester[i]);
				var newli=$("<li></li>");
				var newa=$("<a></a>").addClass("chat-list-a");
				newa.attr("data-toggle","pill");
				newa.attr("href","#chat"+i);
				newa.attr("id","chat-id"+i);
				var newd1=$("<div></div>").addClass("a-agent-name");
				newd1.text(tester[i].agent_nick);
				var newd2=$("<div></div>").addClass("a-visitor-name");
				newd2.text(tester[i].user_nick);
				var newd3=$("<div></div>").addClass("a-time-stamp");
				newd3.text(tester[i].time_stamp);
				$(newa).append(newd1);
				$(newa).append(newd2);
				$(newa).append(newd3);
				$(newli).append(newa);
				$("#all-chat-list").append(newli);
				var chatdiv=$("<div></div>").attr("id","chat"+i);
				chatdiv.addClass("tab-pane fade chat-div-cont");
				$("#specific-chat-container").append(chatdiv);
				
				$(newa).on("click",function(){
					$("#all-chat-list").hide();
					console.log("click121");
					console.log("clicked the chats");
					var check=$(this).attr('id');
					var check2=$(this).attr('href');
					console.log("#"+check+" div:nth-child(2)");
					console.log($("#"+check+" div:nth-child(2)").text());
					console.log("afterwards");
					console.log(check2);
					$(check2).removeClass("hide");
					if ($(check2).is(':empty')){
					var http5 = new XMLHttpRequest();
					var url5 = "/chatret";
					var a1={
						agent:$("#"+check+" div:nth-child(1)").text(),
						user:$("#"+check+" div:nth-child(2)").text()
					}
					http5.open("POST", url5 , true);
					var params5 = JSON.stringify(a1);
					http5.setRequestHeader("Content-type", "application/json");
					http5.onreadystatechange = function() {
						if(http5.readyState == 4 && http5.status == 200) 
						{
							console.log("inside src response ");
							var tester3 = JSON.parse( http5.responseText );
							console.log(tester3);
							console.log(tester3.length);
							var bdiv=$("<div></div>").css("height","50px");
							var newb=$("<button>back</button>").addClass("btn btn-default");
							newb.attr("type","button");
							newb.attr("id","chat-back-button");
							$(bdiv).append(newb);
							$(check2).append(bdiv);

							$(newb).on("click",function(){
								$("#all-chat-list").show();
								$(check2).addClass("hide");
							});
							for(var i=0;i<tester3.length;i++)
							{
								console.log("messages are");
								console.log(tester3[i]);
								var container_div=$("<div></div>").addClass("chat-bubble-admin");
								var chat_div=$("<div></div>").addClass("chat-div");
								var nick_div=$("<div></div>").addClass("chat-nick-div");
								if(tester3[i].agent_message=="")
								{
									container_div.attr("id","you-chat");
									chat_div.text(tester3[i].user_message);
									nick_div.text("user:"+tester3[i].user_nick);
								}
								else{
									container_div.attr("id","me-chat");
									chat_div.text(tester3[i].agent_message);
									nick_div.text("agent:"+tester3[i].agent_nick);
								}
								$(container_div).append(nick_div);
								$(container_div).append(chat_div);
								$(check2).append(container_div);
							}
						}
				}
				http5.send(params5); 
			}
			});
			}
		}
	}
	http7.send();

	var upload=document.getElementById("aa");
	$("#aa").change(function()
	{  
		$("#loading-gif").show();
		$("#squareimg").addClass("loadingstate");
		console.log("click");  
		var file=upload.files[0];
		var reader=new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend=function()
		{
			console.log("inside load end");
			//alert(reader.result);
			$.ajax({
				type: "POST",
				url: "/restapi",
				data: {
					name:file.name,
					result:reader.result,
					email:admail
				}
			});
		}
		setTimeout(function()
		{
			var parent=document.getElementById("profile-photo");
			var http4 = new XMLHttpRequest();
			var url4 = "/get_src";
			var a={
				email:admail
			}
			http4.open("POST", url4 , true);
			var params = JSON.stringify(a);
			http4.setRequestHeader("Content-type", "application/json");
			http4.onreadystatechange = function() {
				if(http4.readyState == 4 && http4.status == 200) 
				{
					$("#loading-gif").hide();
					$("#squareimg").removeClass("loadingstate");
					console.log("inside src response ");
					var tester2 = JSON.parse( http4.responseText );
					console.log(tester2[0].image);
					var avatar=$("#avatar-circle");
					var gif=$("<img>").attr("src","/uploads/"+tester2[0].image);
					$(gif).attr('id','squareimg');
					$(gif).css("height","200px");
					$(gif).css("width","200px");
					$(parent).append(gif);
					var gif1=$("<img>").attr("src","/uploads/"+tester2[0].image);
					$(gif1).attr('id',"gif1");
					$(gif1).css("height","150px");
					$(gif1).css("width","150px");
					$(avatar).append(gif1);
					$("#choosen-file").hide();
					$("#upload-image").hide();
					console.log(gif);
					console.log(parent);
				}
			}
			http4.send(params);
		},2000);
	});


	var ag = $("#agentlist");
	var http = new XMLHttpRequest();
	var url = "/online_agents";
	var a={
		v1:"hello"
	}
	console.log(a);
	var params = JSON.stringify(a);
	http.open("POST", url , true);
	http.setRequestHeader("Content-type", "application/json");
	http.onreadystatechange = function(){
		if(http.readyState == 4 && http.status == 200){
			console.log("in here here here");
			tester = JSON.parse(http.responseText);
			for(var i=0;i<tester.length;i++){
				console.log(tester[i].agent_nick);
				var newag = $("<a></a>");
				var newli = $("<li></li>");
				var newimg=$("<img>").attr("src","");
				newag.attr('href','#');
				newag.attr('id',tester[i].agent_nick);
				newag.text(tester[i].agent_nick);

				newli.append(newag);
				ag.append(newli);
			}
		}
	}
	console.log(params);
	http.send(params);

	setTimeout(function(){
		$name = $("#name");
		$pass = $('#password');
		$confirm = $('#confirm');
		$email = $("#email");
		$button = $('#ok-button');

		$name.val(adname);
		$email.val(admail);

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
	});
		console.log("before get_src");
		console.log(admail);
		var parent=document.getElementById("profile-photo");
		var http4 = new XMLHttpRequest();
		var url4 = "/get_src";
		var a={
			email:admail
		}
		http4.open("POST", url4 , true);
		var params = JSON.stringify(a);
		http4.setRequestHeader("Content-type", "application/json");
		http4.onreadystatechange = function() {
			if(http4.readyState == 4 && http4.status == 200) 
			{
				console.log("inside src response ");
				var tester2 = JSON.parse( http4.responseText );
				for(var i=1;i<tester2.length;i++)
				{
					console.log(tester2[i]);
						var newli=$("<li></li>").attr("id","li"+tester2[i].agent_nick);;
						var newsp=$("<img>").addClass("agent-mgmt-avatar");
						if(tester2[i].image!=="")
						newsp.attr("src","/uploads/"+tester2[i].image);
						else
						newsp.attr("src","/uploads/avatar.png");	
						var newa=$("<a></a>").text(tester2[i].agent_nick);
						$(newli).append(newsp);
						$(newli).append(newa);
						$("#agent-mgmt-list").append(newli);
				}
				var avatar=$("#avatar-circle");
				var gif=$("<img>").attr("src","/uploads/"+tester2[0].image);
				$(gif).attr('id','squareimg');
				$(gif).css("height","200px");
				$(gif).css("width","200px");
				$(parent).append(gif);
				var gif1=$("<img>").attr("src","/uploads/"+tester2[0].image);
				$(gif1).attr('id',"gif1");
				$(gif1).css("height","150px");
				$(gif1).css("width","150px");
				$(avatar).append(gif1);
				$("#choose-file").hide();
				console.log(gif);
				console.log(parent);
			}
		}
		http4.send(params);

	},500);

	socket.emit("admin",adname);

	socket.on('removeagent',function(data){
		console.log(data);
		$("#"+data).remove();
	})

	socket.on('addagent',function(data){
		console.log(data);
		var newag = $("<a></a>");
		var newli = $("<li></li>");
		newag.attr('href','#');
		newag.attr('id',data);
		newag.text(data);
		newli.append(newag);
		ag.append(newli);
	});

	socket.on('s_to_ag',function(data,data1,data2)
	{
		
		console.log($("div[agent-user="+data1+""+data2+"]").attr("id"));
		
		var container_div=$("<div></div>").addClass("chat-bubble-admin");
		var chat_div=$("<div></div>").addClass("chat-div");
		var nick_div=$("<div></div>").addClass("chat-nick-div");
		
		container_div.attr("id","you-chat");
		chat_div.text(data);
		nick_div.text("user:"+data1);

		$(container_div).append(nick_div);
		$(container_div).append(chat_div);
		$("div[agent-user="+data1+""+data2+"]").append(container_div);
		console.log(data);
		console.log(data1);
		console.log(data2);
	});

	socket.on('ag_to_s',function(data,data1,data2)
	{
		console.log($("div[agent-user="+data2+""+data1+"]").attr("id"));
		
		var container_div=$("<div></div>").addClass("chat-bubble-admin");
		var chat_div=$("<div></div>").addClass("chat-div");
		var nick_div=$("<div></div>").addClass("chat-nick-div");

		container_div.attr("id","me-chat");
		chat_div.text(data);
		nick_div.text("agent:"+data1);

		$(container_div).append(nick_div);
		$(container_div).append(chat_div);
		$("div[agent-user="+data2+""+data1+"]").append(container_div);
		
		console.log("msg aa gya dobara");
		console.log(data);
		console.log(data1);
		console.log(data2);

	});

	socket.on('pick',function(vis,ag,timestamp)
	{
		
		console.log("han g call uth gya");
		console.log(vis);
		console.log(ag);
		console.log(timestamp);
		var newli=$("<li></li>");
		var newa=$("<a></a>").addClass("chat-list-a");
		newa.attr("data-toggle","pill");
		newa.attr("href","#chat"+agctr);
		newa.attr("id","chat-id"+agctr);
		var newd1=$("<div></div>").addClass("a-agent-name");
		newd1.text(ag);
		var newd2=$("<div></div>").addClass("a-visitor-name");
		newd2.text(vis);
		var newd3=$("<div></div>").addClass("a-time-stamp");
		newd3.text(timestamp);
		$(newa).append(newd1);
		$(newa).append(newd2);
		$(newa).append(newd3);
		$(newli).append(newa);
		$("#all-chat-list").prepend(newli);
		var chatdiv=$("<div></div>").attr("id","chat"+agctr);
		chatdiv.addClass("tab-pane fade chat-div-cont");
		chatdiv.attr("agent-user",ag+""+vis);
		$("#specific-chat-container").append(chatdiv);
		var bdiv=$("<div></div>").css("height","50px");
		var newb=$("<button>back</button>").addClass("btn btn-default");
		newb.attr("type","button");
		newb.attr("id","chat-back-button");
		$(newb).on("click",function(){
			$("#all-chat-list").show();
			$(chatdiv).addClass("hide");
		});
		$(bdiv).append(newb);
		$(chatdiv).append(bdiv);
		$(newa).on("click",function(){
			$("#all-chat-list").hide();
			$(chatdiv).removeClass("hide");
		});
		agctr++;
	});

	//diplay visitor records
	var visrecords = $("#VisitorRecord");
	var http2 = new XMLHttpRequest();
	var url2 = "/records";
	var a2={
		v1:"hello"
	}
	console.log(a2);
	var params2 = JSON.stringify(a2);
	http2.open("POST", url2 , true);
	http2.setRequestHeader("Content-type", "application/json");
	http2.onreadystatechange = function(){
		if(http2.readyState == 4 && http2.status == 200){
			console.log("in here here here");
			vartester = JSON.parse(http2.responseText);
			for(var i=0;i<tester.length;i++){
				console.log(tester[i].nick+" : "+tester[i].email);
				var newvis = $("<div></div>");
				newvis.text(tester[i].nick+" : "+tester[i].email);
				visrecords.append(newvis);
			}
		}
	}
	console.log(params2);
	http2.send(params2);

	var http9 = new XMLHttpRequest();
	var url9= "/query_list";
	http9.open("GET", url9 , true);
	http9.onreadystatechange = function() {
		if(http9.readyState == 4 && http9.status == 200) 
		{
			console.log("in here here here");
			console.log("pending aadmi are");
			var tester67=JSON.parse(http9.responseText);
			for(var i=0;i<tester67.length;i++)
			{
				console.log(tester67[i]);
				var newli=$("<li></li>");
				var newa=$("<a></a>").addClass("chat-list-a");
				newa.attr("data-toggle","pill");
				newa.attr("href","#pchat"+i);
				newa.attr("id","pchat-id"+i);
				var newd1=$("<div></div>").addClass("a-agent-name");
				newd1.text(tester67[i].email);
				var newd3=$("<div></div>").addClass("a-time-stamp");
				newd3.text(tester67[i].time_stamp);
				$(newa).append(newd1);
				$(newa).append(newd3);
				$(newli).append(newa);
				$("#all-pending-chat-list").append(newli);
				var pchatdiv=$("<div></div>").attr("id","pchat"+i);
				pchatdiv.addClass("tab-pane fade");
				pchatdiv.text(tester67[i].query);
				$("#specific-pchat-container").append(pchatdiv);
			}
		}
	}
	http9.send();

	$("#logout").on("click",function()
	{
		location="http://"+con_ip+":"+port_no+"/login";
	});

	$("#remove-button").on("click",function()
	{
		var agent_nick=$(".new-agent-ninp1").val();
		var agent_email=$(".new-agent-einp1").val();
		console.log(agent_nick+"  "+agent_email);
		var http3 = new XMLHttpRequest();
		var url3 = "/del_agent";

		var a3={
			v1:agent_nick,
			v2:agent_email
		}
		console.log(a3);
		var params3 = JSON.stringify(a3);
		http3.open("POST", url3 , true);
		http3.setRequestHeader("Content-type", "application/json");
		http3.onreadystatechange = function() {
			if(http3.readyState == 4 && http3.status == 200) 
			{
				$("#li"+agent_nick).remove();
				console.log("deleted");
			}
		}
		http3.send(params3);
		$(".new-agent-ninp1").val("");
		$(".new-agent-einp1").val("");
	});
});