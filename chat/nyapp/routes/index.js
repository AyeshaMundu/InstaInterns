var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var multer = require('multer');
var fs=require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var im = require("imagemagick");
var app=express();
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({limit:'5mb'}));
app.use(express.static(path.join(__dirname, 'public')));
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'chat-system'
});
var bb;
connection.connect(function(err)
{
	if(!err) {
		console.log("Database is connected ... nn");    
	} 
	else {
		console.log("Error connecting database ... nn");    
	}
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'InstaRem india pvt. ltd.' ,layout:'visitor'});

});

router.get('/login', function(req, res, next) {
  res.render('index', { title: 'InstaRem login' ,layout:'login'});

});
router.get('/agent',function(req,res,next){
	console.log("inside /agent");
  res.render('agent_page',{name:bb,layout:'agent_page'});
});

router.get('/admindisplay', function(req, res, next) {
  res.render('admin_query', { title: 'Query Page' ,layout:'admin_query'});
});

router.get('/adminchats', function(req, res, next) {
  res.render('admin_chat', { title: 'InstaRem india pvt. ltd.' ,layout:'admin_chat'});
});

router.get('/agent_profile', function(req, res, next) {
  res.render('agent_profile', { title: 'Profile Page' ,layout:'agent_profile'});
});

router.get('/admin', function(req, res, next) {
  res.render('admin_home', { title: 'Admin Page' ,layout:'admin_home'});
});

router.post('/restapi',function (req, res, next){
  console.log("in restapi");
  console.log(req.body.name);
  console.log(req.body.email);
  var b64Data=req.body.result.split(',')[1];
  var buffer=new Buffer(b64Data,'base64');
  require("fs").writeFile("public/uploads/"+req.body.name,b64Data, 'base64', function(err) {
    console.log(err);
  });
  console.log("here goes");
  connection.query('UPDATE `employee` SET `image`=? WHERE `email`=?',[req.body.name,req.body.email],function(err, rows1 ){
    console.log("updated");
  });
  // var args1 = [
  // "public/uploads/"+req.body.name,
  // "-resize",
  // "x200",
  // "public/uploads/"+req.body.name
  // ];

  // im.convert(args1, function(err) {
  //   if(err) { throw err; }
  //   res.end("Image crop complete");
  // });
 /*   var args = [
  "public/uploads/"+req.body.name,
  "-crop",
  "200x200+188+352",
  "output.jpeg"
  ];

 im.convert(args, function(err) {
    if(err) { throw err; }
    res.end("Image crop complete");
  });*/
});

router.post('/get_src', function(req, res, next) {
  console.log(req.body.email);
  console.log("inside getsrc");
  connection.query('SELECT `id` from `employee` where `email`=?',[req.body.email],function(err, rows11 )
  {
    console.log("found id");
    console.log(rows11[0].id);
   if(rows11[0].id==1)
    {
      connection.query('SELECT `image`,`agent_nick` from `employee`',function(err, rows12 )
      {
        console.log("found");
        console.log(rows12);
        res.json(rows12);
      });

    }
    else
    {
      connection.query('SELECT `image` from `employee` where `email`=?',[req.body.email],function(err, rows12 )
      {
        console.log("found");
        //console.log(rows11);
        res.json(rows12);
      });
    }
  });
});

router.post('/chatret', function(req, res, next) {
  console.log(req.body.agent);
  console.log(req.body.user);
  console.log("inside chatret");
  connection.query('SELECT `agent_nick`,`user_nick`,`user_message`,`agent_message`,`time_stamp` from `chatapp-table` where `agent_nick`=? and `user_nick`=?',[req.body.agent,req.body.user],function(err, rows11 )
  {
    console.log("found chats");
    console.log(rows11);
    res.json(rows11);
  });
});

router.post('/rest',function(req,res,next){


console.log(" yahan pe here");
  console.log(req.body.v1);
  
  console.log(req.body.v2);
  //handle_database(req,res);
  var data=req.body.v1;
  var data1=req.body.v2;
  connection.query('SELECT * FROM `employee` where `email`=? and `password`=?',[data,data1],function(err, rows) {
  	if(err){
  		res.json({"code" : 100, "status" : "Error in connection database"});
  	}
  	else{
  		console.log("yeses baby");
  		console.log(rows);
  		if(rows!=0){
  			var id=rows[0].id;
  			var agnick=rows[0].agent_nick;
  			console.log(id);
  			console.log(agnick);
  			bb=agnick;
  			if(rows[0].id==1){
  				console.log("admin");
  				res.json(rows);
  			}
  			else{
  				console.log("agent");
  				res.json(rows);
          connection.query('SELECT count(*) as ct from `allocation` where `agent_nick` = ?',[agnick],function(err, row){
            console.log(row[0].ct);
            if(row[0].ct<1){
              connection.query('INSERT INTO `allocation`(`agent_nick`, `slots`,`status`) VALUES (?,0,1)',[rows[0].agent_nick]);
            }
          });
        }
  			console.log("valid");
  		}
  		else{
  			console.log("invalid");
  			res.json(rows);
  		}
  	}
  });
});

router.post('/log_out',function(req,res,next){
	console.log(req.body.v1);
	console.log("inside logout router");
	connection.query('SELECT `slots` FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1) {
		console.log("ho gya yes yes");
		if(rows1.length>0){
			console.log(rows1[0].slots);
			if(rows1[0].slots>0){
				res.json(rows1);

			}
			else{
				connection.query('DELETE FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1 ){
          console.log("ho gya yes yes");
          res.json([]);
        });
			}
		}
	});
});

router.post('/offline',function(req,res,next){
	console.log(req.body.v1);
	console.log("inside offline router");
	connection.query('SELECT `slots` FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1){
		console.log("ho gya yes yes");
		console.log("slots "+rows1[0].slots);
		if(rows1[0].slots>0){
			res.json(rows1);
		}
		else{
			connection.query('UPDATE `allocation` SET `status`=0 WHERE `agent_nick`=?',[req.body.v1],function(err, rows1){
				console.log("ho gya yes yes");
				res.json([]);
			});
		}
  });
});

router.post('/online',function(req,res,next){
	console.log(req.body.v1);
	console.log("inside offline router");
	connection.query('UPDATE `allocation` SET `status`=1 WHERE `agent_nick`=?',[req.body.v1],function(err, rows1) {
                    console.log("ho gya yes yes");
                	res.json("yes");
	});
});

router.post('/agent_pick',function(req,res,next){
	console.log(req.body.v1);
	console.log("inside agent pick router");
	connection.query('SELECT `slots` FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1) 
	{
        console.log("slots is "+rows1[0].slots);
         connection.query('UPDATE `allocation` SET `slots`=? WHERE `agent_nick`=?',[rows1[0].slots+1,req.body.v1],function(err, rows1) 
         {
            console.log("added slots");
            res.json("yes");
		});       	

	});
});

router.post('/agent_close',function(req,res,next){
  console.log(req.body.v1);
  console.log("inside agent disconnect router");
  connection.query('DELETE FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1 )
  {
    res.json("yes");
      console.log("deleted");
   });      
});

router.post('/visitor',function(req,res,next){
	console.log(req.body.v1);
  var a = req.body.v1;
  var b = req.body.v2;
  console.log("inside visitor router");
  connection.query("INSERT INTO `visitor-table`(`nick`, `email`) VALUES (?,?)",[a,b]);
  connection.query('SELECT `agent_nick` FROM `allocation` WHERE `slots`=(SELECT min(`slots`) from `allocation` where `slots`<5) order by `agent_nick`',function(err, rows1) {
    console.log("ho gya yes yes");
    res.json(rows1);
  });
});

router.post('/agent-mail',function(req,res,next){
  var agname = req.body.v1;
  connection.query("SELECT `email` FROM `employee` WHERE `agent_nick` = ?",[agname],function(err,rows3){
    console.log("agent ka email "+rows3[0].email);
    res.json(rows3[0].email);
  })
});

router.get('/get_list',function(req,res,next){
  connection.query("SELECT `agent_nick`,`user_nick`,`time_stamp` FROM `chatapp-table` group by `agent_nick`,`user_nick` ",function(err,rows3){
    console.log(rows3);
    res.json(rows3);
  })
});

router.post('/visitor-query',function(req,res,next){
  var mail = req.body.v1;
  var que = req.body.v2;
  connection.query("INSERT INTO `ticket-table`(`email`, `query`) VALUES (?,?)",[mail,que]);
  res.json("done");
})

router.post("/chats",function(req,res,next){
  connection.query("SELECT `time_stamp`, `user_nick`, `user_message`, `agent_nick`, `agent_message` FROM `chatapp-table` WHERE 1",function(err,row8){
    res.json(row8);
  })
})

router.post("/updation",function(req,res,next){
  var name = req.body.v1;
  var pass = req.body.v2;
  var emailid = req.body.v3;
  connection.query("UPDATE `employee` SET `password`=?,`agent_nick`=? WHERE `email` = ?",[pass,name,emailid]);
  res.json("ho gaya");
})

router.post("/online_agents",function(req,res,next){
  connection.query("SELECT `agent_nick` FROM `allocation` WHERE `status` = 1",function(err,row9){
    res.json(row9);
  })
})

router.post("/admin_name&email",function(req,res,next){
  console.log("admin name and email");
  connection.query("SELECT `email`, `agent_nick` FROM `employee` WHERE `id` = 1",function(err,row5){
    console.log("admin ki details")
    console.log(row5);
    res.json(row5);
  })
})

router.post("/records",function(req,res,next){
  connection.query("SELECT `nick`, `email` FROM `visitor-table` WHERE 1",function(err,row4){
    res.json(row4);
  })
})

router.post('/vchat_add',function(req,res,next){
	console.log(req.body.v1);
	console.log(req.body.v2);
	console.log("inside chat_add router visitor");
	connection.query('INSERT INTO `chatapp-table`(`time_stamp`, `user_nick`, `agent_nick`, `user_message`) VALUES (CURRENT_TIMESTAMP,?,?,?)',[req.body.v1,req.body.v2,req.body.v3],function(err, rows1){
      res.json("yes");
	});
});

router.post("/display-query",function(req,res,next){
  connection.query("SELECT `email`, `query` FROM `ticket-table` WHERE 1",function(err,row7){
    console.log("tickets....")
    console.log(row7);
    res.json(row7);
  })
})

router.post("/filter-query",function(req,res,next){
  console.log(req.body.v1);
  connection.query("SELECT `email`, `query` FROM `ticket-table` WHERE `email` LIKE CONCAT('%', ?, '%')",[req.body.v1],function(err,row6){
    console.log("tickets....")
    console.log(row6);
    res.json(row6);
  })
})

router.post('/achat_add',function(req,res,next){
	console.log(req.body.v1);
	console.log(req.body.v2);
	console.log("inside chat_add router visitor");
	connection.query('INSERT INTO `chatapp-table`(`time_stamp`, `user_nick`, `agent_nick`, `agent_message`) VALUES (CURRENT_TIMESTAMP,?,?,?)',[req.body.v1,req.body.v2,req.body.v3],function(err, rows1){
    res.json("yes");
	});
});


router.post('/slot_decrease',function(req,res,next)
{
	console.log(req.body.v1);
	console.log("inside slots decrease");
	connection.query('SELECT `slots` FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1) 
	{
    console.log("slots is "+rows1[0].slots);
    connection.query('UPDATE `allocation` SET `slots`=? WHERE `agent_nick`=?',[rows1[0].slots-1,req.body.v1],function(err, rows1)
    {
     console.log("decrease slots");
      
      res.json("yes");
    });       	

	});
});

router.post('/add_agent',function(req,res,next){
  connection.query("INSERT into `employee`(`agent_nick`,`email`,`password`) VALUES(?,?,12345)",[req.body.nick,req.body.email],function(err,rows3){
    res.json("ho gya bhaiyo");
  })
});

router.get("/query_list",function(req,res,next){
  connection.query("SELECT `email`,`query`,`time_stamp` FROM `ticket-table` WHERE 1",function(err,row15){
    console.log("tickets....")
    console.log(row15);
    res.json(row15);
  })
})

router.post('/del_agent',function(req,res,next){
  console.log("inside delete agent router");
  connection.query('DELETE FROM `employee` WHERE `agent_nick`=? and `email`=?',[req.body.v1,req.body.v2],function(err, rows1 )
  {
         console.log("ho gya yes yes");
          res.json("young mula baby");
    });
})

module.exports = router;
