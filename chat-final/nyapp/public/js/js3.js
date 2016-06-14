
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




                         $messageform.submit(function(e){
                         e.preventDefault();
                        socket.emit('send message',$messagebox.val());
                        $messagebox.val('');
                        });

                        socket.on('new message',function(data){

                        $chat.append("<b>"+data.nick +" : </b>"+data.msg+"<br/>" );

                        });

                });

