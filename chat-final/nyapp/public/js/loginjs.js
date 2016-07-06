
jQuery(function($){

  console.log("hereeeweeebvh");
  var $loginForm=$(".form-signin");
  var $inputEmail=$("#inputEmail");
  var $inputPassword=$("#inputPassword");
  var prof=$('#profile-name');
  prof.hide();
  $loginForm.submit(function (e){
    console.log("here");
    e.preventDefault();

    console.log(document.getElementById("inputPassword").value);
    var http = new XMLHttpRequest();
    var url = "/rest";
    var a={

      v1:document.getElementById("inputEmail").value,
      v2:document.getElementById("inputPassword").value

    }
    console.log(a);
    var params = JSON.stringify(a);

    http.open("POST", url , true);


    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() {
      if(http.readyState == 4 && http.status == 200) {

       console.log("in here");
       console.log(http.responseText);
       var tester = JSON.parse( http.responseText );
       if(tester!=0)
       {
        $("#profile-name").hide();
        console.log("valid match");
        if(tester[0].id==1)
        {
          location="http://localhost:3000/admin";
        }
        else
        {
          console.log("agent has logged in");
          location="http://localhost:3000/agent";
          console.log("here i am");
        }
      }
      else
      {
        console.log("invalid match");
        $("#profile-name").show();
        prof.show();
        $(".form-control").css("border-color","red");
      }

    }
  }
  console.log(params);
  http.send(params);
  $inputPassword.val('');
  $inputEmail.val('');
  console.log("hello munna");
});
});

