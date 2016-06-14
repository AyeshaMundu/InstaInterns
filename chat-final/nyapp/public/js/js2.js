
 jQuery(function($){


                        var socket=io.connect();
                        var $messageform=$("#send-message");
			var $nickForm=$("#setNick");
			var $nickError=$("#nickError");
			var $nickBox=$("#nickname");
            var $users=$("#users");
                        var $messagebox=$("#message");
                        var $chat=$("#chat");

                			
                        $nickForm.submit(function (e){
                            e.preventDefault();
                            socket.emit('new user',$nickBox.val(),function(data){
                                    if(data){
                                        $("#nickWrap").hide();
                                        $("#contentWrap").show();
                                    }
                                    else
                                    {
                                        $nickError.html("That username is already taken!  Try again.");
                                    }
                            });
                            $nickBox.val('');
                        
                        });

                        socket.on('usernames',function(data){
                             var html='';
                             for(i=0;i<data.length;i++){
                                html+=data[i] +'<br/>';
                             }
                            $users.html(html);
                        });


                        socket.on('new wala message',function(data){

                            console.log("in new wala message");
                            var i;
                            for(i=7;i>=0;i--)
                            {
                              $chat.append('<span class="msg"><b>'+data[i].nick+':</b>'+data[i].message+"</span><br/>"); 
                            }


                        });




                         $messageform.submit(function(e){
                         e.preventDefault();
                        socket.emit('send message',$messagebox.val(),function(data){
                            
                            $chat.append('<span class="error">'+data+"</span><br/>");
                        });
                        $messagebox.val('');
                        });

                        socket.on('new message',function(data){

                       $chat.append('<span class="msg"><b>'+data.nick+':</b>'+data.msg+"</span><br/>");

                        });

                        socket.on('whisper',function(data){
                            $chat.append('<span class="whisper"><b>'+data.nick+':</b>'+data.msg+"</span><br/>");

                        });

                });

