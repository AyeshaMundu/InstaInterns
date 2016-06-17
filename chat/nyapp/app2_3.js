var express=require('express');
app=express();
server=require('http').createServer(app);
var bodyParser = require('body-parser')
app.use( bodyParser.json() ); 
io=require('socket.io').listen(server);
var path=require('path');

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'hbs');

var fs=require('fs');

users={};

server.listen(3000);

app.use(express.static(path.join(__dirname,'public')));

     




/*app.get('/',function(req,res){
res.sendfile(__dirname+'/login.html');
});*/

app.get('/admin',function(req,res){
res.sendfile(__dirname+'/admin.html');
});

app.get('/agent',function(req,res){
res.sendfile(__dirname+'/agent_page.html');
});

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'chat-system'
});

connection.connect(function(err){
					if(!err) {
    							console.log("Database is connected ... nn");    
							} 
					else {
    						console.log("Error connecting database ... nn");    
						}
					});




io.sockets.on('connection',function(socket){
		

		
			





	

		







		socket.on('new user',function(data,callback){
			if(data in users){
				callback(false);
			}
			else{



				callback(true);
				socket.nickname=data;
				users[socket.nickname]=socket;
				updateNicknames();
				
				connection.query('SELECT * FROM `chat-table` ORDER by id desc LIMIT 8 ',function(err, rows) {
   						console.log("yes baby");
   						/*var k=0;
   						for(k=0;k<8;k++)
   						console.log(rows[k].message);*/
   						
   						socket.emit('new wala message',rows);
				});

        		
				
			}



			

		});
		function updateNicknames(){

			io.sockets.emit('usernames',Object.keys(users));
		}
        socket.on('send message',function(data,callback){

        		var msg=data.trim();
        		if(msg.substring(0,3) ==='/w ')
        		{
        			console.log("here");
        			msg=msg.substring(3);
        			var ind=msg.indexOf(' ');
        			if(ind!==-1)
              {
        				var name=msg.substring(0,ind);
        				var msg=msg.substring(ind+1);
        				if(name in users)
        				{
        				users[name].emit('whisper',{msg:msg,nick:socket.nickname});
        				console.log("whisper");
        				}
        				else
        					{callback("error enter a valid user");}

        			}
   
        			else{
        			
        			callback("error enter message for your whisper");
        			}
        		}
        		else{	
        			
        			

        			connection.query('INSERT INTO `chat-table`(`id`, `created`, `message`, `nick`) VALUES (NULL,CURRENT_TIMESTAMP,?,?)',[msg,socket.nickname],function(err, rows) {
   						console.log("yes baby");
   						console.log(rows);
  					});
					
               		io.sockets.emit('new message',{msg:msg,nick:socket.nickname});
           		}
           	
        });
        socket.on('disconnect',function(data){
        	if(!socket.nickname) return;
        	delete users[socket.nickname];
        	updateNicknames();

        });
});

app.post('/agent_login',function(req,res,next){
  console.log("here in babu");
  console.log(req.body.v1);
res.writeHead(200,{'Content-type':'text/html'});
          fs.readFile('agent_page.html',null,function(error,data){
            console.log("ho rha h");
            console.log(data);
                            res.write(data);
                                     res.end();
              });
        });



app.post('/rest',function(req, res, next){
   // res.render('rest', { title: 'AYESHA', layout: 'rest'
  // })
  console.log("here");
  console.log(req.body.v1);
  
  console.log(req.body.v2);
  //handle_database(req,res);
  var data=req.body.v1;
  var data1=req.body.v2;
  connection.query('SELECT * FROM `employee` where `email`=? and `password`=?',[data,data1],function(err, rows) {
              if(err)
              {
                res.json({"code" : 100, "status" : "Error in connection database"});
              }
              else
              {
                console.log("yeses baby");
                /*var k=0;
                for(k=0;k<8;k+in+)
                console.log(rows[k].message);*/
                console.log(rows);
                
                //console.log(sizeof(rows));
                if(rows!=0)
                {
                  var id=rows[0].id;
                var agnick=rows[0].agent_nick;
                console.log(id);
                console.log(agnick);
                  if(rows[0].id==1)
                    {
                      console.log("admin");
                      res.json(rows);
                      //socket.emit("admin_login",agnick);

                    }
                    else
                    {
                     

                     console.log("agent");
                     //socket.emit("agent_login",agnick);
                     res.json(rows);


                    }

                  console.log("valid");

                  connection.query('SELECT count(*) as ct from `allocation` where `agent_nick` = ?',agnick,function(err, row) {
                  console.log(row[0].ct);
                  if(row[0].ct<1)
                  {
                    connection.query('INSERT INTO `allocation`(`agent_nick`, `slots`) VALUES (?,0)',[rows[0].agent_nick],function(err, rows1) {
                    console.log("ho gya baby");
                


                  });

                  }
    

                  });
                



                }
                  
                else
                  {
                    console.log("invalid");
                    //socket.emit('invalid_login');
                    res.json(rows);
                  }
              }
        });
});
