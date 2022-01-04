import express from 'express';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';



const app = express();
const server = Server(app);
const io = Socket(server);

app.set('view engine', 'ejs'); //we will use EJS to simplify client side
app.use(express.static('public')) //express will pull client scripts from public folder

app.get('/', (req, res) => res.redirect(`/${uuidv4()}`)); // creates a new chat room with a random uuid

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



