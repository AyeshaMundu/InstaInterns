var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
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

router.post('/rest',function(req,res,next){


console.log(" yahan pe here");
  console.log(req.body.v1);
  
  console.log(req.body.v2);
  //handle_database(req,res);
  var data=req.body.v1;
  var data1=req.body.v2;
  connection.query('SELECT * FROM `employee` where `email`=? and `password`=?',[data,data1],function(err, rows) 
  {
  	if(err)
  	{
  		res.json({"code" : 100, "status" : "Error in connection database"});
  	}
  	else
  	{
  		console.log("yeses baby");
  		console.log(rows);
  		if(rows!=0)
  		{
  			var id=rows[0].id;
  			var agnick=rows[0].agent_nick;
  			console.log(id);
  			console.log(agnick);
  			bb=agnick;
  			if(rows[0].id==1)
  			{
  				console.log("admin");
  				res.json(rows);


  			}
  			else
  			{

  				console.log("agent");

  				res.json(rows);


  			}

  			console.log("valid");

  			connection.query('SELECT count(*) as ct from `allocation` where `agent_nick` = ?',[agnick],function(err, row) 
  			{
  				console.log(row[0].ct);
  				if(row[0].ct<1)
  				{
  					connection.query('INSERT INTO `allocation`(`agent_nick`, `slots`,`status`) VALUES (?,0,1)',[rows[0].agent_nick],function(err, rows1) 
  					{
  					
  					});

  				}


  			});

  		}

  		else
  		{
  			console.log("invalid");

  			res.json(rows);
  		}
  	}
  });

});

router.post('/log_out',function(req,res,next){
	console.log(req.body.v1);
	console.log("inside logout router");
	connection.query('SELECT `slots` FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1) 
	{
		console.log("ho gya yes yes");
		if(rows1.length>0)
		{
			console.log(rows1[0].slots);
			if(rows1[0].slots>0)
			{
				res.json(rows1);

			}
			else
			{
				connection.query('DELETE FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1 )
				{
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
	connection.query('SELECT `slots` FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1) 
	{
		console.log("ho gya yes yes");
		console.log("slots "+rows1[0].slots);
		if(rows1[0].slots>0){
			res.json(rows1);

		}
		else
		{
			connection.query('UPDATE `allocation` SET `status`=0 WHERE `agent_nick`=?',[req.body.v1],function(err, rows1) {
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
	console.log("inside visitor router");
	connection.query('SELECT `agent_nick` FROM `allocation` WHERE `slots`=(SELECT min(`slots`) from `allocation` where `slots`<5) order by `agent_nick`',function(err, rows1) {
                    console.log("ho gya yes yes");
                	res.json(rows1);


    });
});



router.post('/vchat_add',function(req,res,next){
	console.log(req.body.v1);
	console.log(req.body.v2);
	console.log("inside chat_add router visitor");
	connection.query('INSERT INTO `chatapp-table`(`time_stamp`, `user_nick`, `agent_nick`, `user_message`) VALUES (CURRENT_TIMESTAMP,?,?,?)',[req.body.v1,req.body.v2,req.body.v3],function(err, rows1) 
	{
      res.json("yes");
	});

});
router.post('/achat_add',function(req,res,next){
	console.log(req.body.v1);
	console.log(req.body.v2);
	console.log("inside chat_add router visitor");
	connection.query('INSERT INTO `chatapp-table`(`time_stamp`, `user_nick`, `agent_nick`, `agent_message`) VALUES (CURRENT_TIMESTAMP,?,?,?)',[req.body.v1,req.body.v2,req.body.v3],function(err, rows1) 
	{
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
/*router.post('/delete',function(req,res,next){
	console.log(req.body.v1);
	console.log("inside delete router");
	connection.query('DELETE FROM `allocation` WHERE `agent_nick`=?',[req.body.v1],function(err, rows1 )
	{
         console.log("ho gya yes yes");
        	res.json("young mula baby");
    });
})*/
module.exports = router;
