const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs'); //we will use EJS to simplify client side
app.use(express.static('public')) //express will pull client scripts from public folder

app.get('/', (req, res) => res.redirect(`/${uuidV4()}`)); // creates a new chat room with a random uuid

app.get('/:room', (req, res) => res.render('room', { roomId: req.params.room })); // user can enter an existing room via path params

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(5050)



