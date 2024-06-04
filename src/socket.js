const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const ChatRoom = require('./models/chatRoom');

const setupSocket = (server) => {
    const io = socketio(server);

    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.user = decoded;
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        socket.on('joinRoom', ({ chatRoomId }) => {
            socket.join(chatRoomId);
        });

        socket.on('sendMessage', async ({ chatRoomId, content }) => {
            const message = await Message.create({
                userId: socket.user.id,
                chatRoomId,
                content
            });
            io.to(chatRoomId).emit('newMessage', message);
        });
    });
};

module.exports = setupSocket;
