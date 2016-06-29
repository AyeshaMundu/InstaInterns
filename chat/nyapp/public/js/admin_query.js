jQuery(function($){
	var but = $("#searchbut");
	but.click(function(e){
		var searchval = document.getElementById("searchbox").value;
		console.log(searchval);
		//e.preventDefault();
		console.log("inside button click");
		var http = new XMLHttpRequest();
		var url = "/filter-query";
		var a={
			v1:searchval
		}
		$(".row").remove();
		var container = $(".container");
		console.log(a);
		var params = JSON.stringify(a);
		http.open("POST", url , true);
		http.setRequestHeader("Content-type", "application/json");
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) 
			{
				console.log("in here here here");
				for(var i=0;i<JSON.parse(http.responseText).length;i++){
				//console.log(JSON.parse(http.responseText)[i].email+" "+JSON.parse(http.responseText)[i].query);
				var new_row= $("<div></div>").addClass("row");
				var new_col1= $("<div></div>").addClass("col-md-6");
				var new_col2= $("<div></div>").addClass("col-md-6");
				new_col1.text(JSON.parse(http.responseText)[i].email);
				new_col2.text(JSON.parse(http.responseText)[i].query);
				new_row.append(new_col1);
				new_row.append(new_col2);
				container.append(new_row);
			}
		}
	}
	console.log(params);
	http.send(params);
})
	var http = new XMLHttpRequest();
	var url = "/display-query";
	var a={
		v1:"hello"
	}
	var container = $(".container");
	console.log(a);
	var params = JSON.stringify(a);
	http.open("POST", url , true);
	http.setRequestHeader("Content-type", "application/json");
	http.onreadystatechange = function() {
		if(http.readyState == 4 && http.status == 200) 
		{
			console.log("in here here here");
			for(var i=0;i<JSON.parse(http.responseText).length;i++){
				//console.log(JSON.parse(http.responseText)[i].email+" "+JSON.parse(http.responseText)[i].query);
				var new_row= $("<div></div>").addClass("row");
				var new_col1= $("<div></div>").addClass("col-md-6");
				var new_col2= $("<div></div>").addClass("col-md-6");
				new_col1.text(JSON.parse(http.responseText)[i].email);
				new_col2.text(JSON.parse(http.responseText)[i].query);
				new_row.append(new_col1);
				new_row.append(new_col2);
				container.append(new_row);
			}
		}
	}
	console.log(params);
	http.send(params);
})