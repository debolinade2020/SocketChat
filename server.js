const mongoose = require('mongoose');
const Msg = require('./models/messages.js');

const http=require("http");
const express=require("express");

const app=express();

const server=http.createServer(app);
const port=process.env.PORT || 3000;

const mongoDB = 'mongodb+srv://user:de123@chatapp.hg6ggxl.mongodb.net/ChatApp?retryWrites=true&w=majority';
mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
  console.log('connected')
}).catch(err => console.log(err))


app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html');
});

/*Socket.io Setup*/

const io=require("socket.io")(server);
var users={};

io.on("connection",(socket)=>{

  socket.on("new-user-joined",(username)=>{
    users[socket.id]=username;
    socket.broadcast.emit('user-connected',username);
    io.emit("users-list",users);
  });

  socket.on("disconnect",()=>{
    socket.broadcast.emit('user-disconnected',user=users[socket.id]);
    delete user[socket.id];
  })


  socket.on("message",(data)=>{
    socket.broadcast.emit('message',{user: data.user,msg: data.msg});
  })

  socket.on("chatmessage",(msg)=>{
    const message = new Msg({msg});
    message.save().then(()=> {
      io.emit("message",msg);
    })
  });

});


/*Socket.io Setup Ends*/

server.listen(port,()=>{
  console.log("Server started at"+port);
});