const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {
    ExpressPeerServer
} = require('peer');
const peerserver = ExpressPeerServer(server, {
    debug: true
})
const {
    v4: uuidv4
} = require('uuid');

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use('/peerjs', peerserver);
app.get('/', (req, resp) => {
    resp.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, resp) => {
    resp.render('room', {
        roomid: req.params.room
    })
})


io.on('connection', Socket => {
    Socket.on('join-room', (roomid,userid) => {
        Socket.join(roomid);
        io.to(roomid).emit("user-connected", userid)
    Socket.on('message',message =>{
        io.to(roomid).emit('creatmessage',message)
    })
    
    })
})
server.listen(process.env.PORT||3030)