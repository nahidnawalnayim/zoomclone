const express=require('express');
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const {ExpressPeerServer}=require('peer');
const peerserver=ExpressPeerServer(server,{debug:true});

const { v4: uuidv4 } = require('uuid');
app.use('/peerjs',peerserver);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('home',{roomId:req.params.room})
})

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)
        //messsage
        socket.on('message',(message)=>{
            io.to(roomId).emit('create-message',message)
        })

        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('user-disconnected',userId)
        })
    })
})
server.listen(process.env.PORT || 3030)