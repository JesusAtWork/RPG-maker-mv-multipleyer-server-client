var app = require ('express')();
var server = app.listen (8000,function()
{
	console.log('Running on port 8000');
	
}); 

var io = require ('socket.io') (server);

io.on('connection' , function(client)
{
	
	console.log (client.id +' has in !');
	client.on('hi',function(){
		console.log(client.id+ ' said hi!');
		client.emit('hi');
	});
	
	
		client.on('move',function(x,y){
		
		console.log (client.id +':('+x +':'+y+')');
		client.broadcast.emit('person-moved',x,y,client.id);
	});
});