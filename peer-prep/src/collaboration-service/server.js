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
    cors:{
      origin:'http://localhost:3002',
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
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // use express's built-in middleware
app.use(express.json()); // This is the middleware to handle JSON payloads

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'client-side', 'index.html'));
});

io.on('connection', async(socket) => {

    console.log('mongoose connected: ', mongoose.connection.readyState, mongoose.connection.host);

    console.log('socket connected: ', socket.id);

    await startCollaboration(socket);

});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({ error: err.message });
});

server.listen(3002, () => {
    console.log('Collaboration service listening on port 3002');
});

module.exports = { io, connectDB };