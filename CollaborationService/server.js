const { Server } = require('socket.io');
const { createServer } = require('node:http');
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/config');
const server = createServer(app);
const io = new Server(server, {
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

app.use('/', routes);

io.on('connection', async(socket) => {

    console.log('socket connected: ', socket.id);

    await startCollaboration(socket, io);

});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({ error: err.message });
});

server.listen(config.PORT, () => {
    console.log(`Collaboration service listening on port ${config.PORT}`);
});

module.exports = { io };