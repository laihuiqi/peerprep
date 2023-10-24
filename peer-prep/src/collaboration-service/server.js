const { Server } = require('socket.io');
const { createServer } = require('node:http');
const { join } = require('node:path');
const cors = require('cors');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/config');
const server = createServer(app);
const io = new Server(server, {
    pingTimeout: 2 * 3600 * 1000,
    cors:{
      origin:'*',
      optionsSuccessStatus:200
    }
  });
const { startCollaboration } = require('./services/collaborationService');

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(config.mongodbUri, { 
            useNewUrlParser: true,
            useUnifiedTopology: true 
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (err) {
        console.log(`MongoDB Error: ${err.message}`);

        process.exit(1);
    }
};

connectDB();

app.use(cors());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true })); // use express's built-in middleware
app.use(express.json()); // This is the middleware to handle JSON payloads

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'client-side', 'index.html'));
});

app.get('/client.js', (req, res) => {
    console.log("getting client.js", join(__dirname, 'client-side', 'client.js'));
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(join(__dirname, 'client-side', 'client.js'));
  });

io.on('connection', async(socket) => {

    console.log('mongoose connected: ', mongoose.connection.readyState, mongoose.connection.host);

    console.log('socket connected: ', socket.id);
    /*

    const sessionId = "123c44c9-9bc3-402f-ba56-689eb0d2774d";
    const userId = 1;

    socket.join(sessionId);
    socket.emit('join', sessionId);
    socket.to(sessionId).emit('user-joined', userId);
    socket.emit('init-code', 'java', []);
    socket.on('update-code', (line, code) => {
        socket.broadcast.to(sessionId).emit('code-changed', line, code);
    });

    socket.on('clear', () => {
        console.log(`Clearing code input storage for session ${sessionId}`);

        socket.broadcast.to(sessionId).emit('cleared', sessionId);
    });

    socket.on('change-line', (line, code) => {
        console.log(`Shanging code input storage for session ${sessionId}`);
        socket.broadcast.to(sessionId).emit('code-changed', line, code);
    });

    socket.on('extend-time', () => {
        console.log(`Extending time for session ${sessionId}`);

        io.emit('time-extended', config.EXTENSION_TIME);
    });

    socket.on('user-terminate', (line, code) => {
        console.log(`User terminated session ${sessionId}`);
        socket.broadcast.to(sessionId).emit('notify-terminate', sessionId);
        socket.disconnect();
    });

    socket.on('ack-terminate', (line, code) => {
        console.log(`User acknowledged termination for session ${sessionId}`);
        socket.disconnect();
    });
    

    socket.on('disconnect', () => {
        console.log('user disconnected: ', userId);

        socket.broadcast.to(sessionId).emit('user-disconnected', userId);
    });

    socket.on('reconnect', () => {
        console.log('user reconnected: ', userId);

        socket.emit('success-reconnected', []);

        socket.broadcast.to(sessionId).emit('user-reconnected', userId);

    });
    */
    await startCollaboration(socket, io);

});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({ error: err.message });
});

server.listen(3002, () => {
    console.log('Collaboration service listening on port 3002');
});

module.exports = { io, connectDB };