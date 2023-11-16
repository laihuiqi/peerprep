const { Server } = require('socket.io');
const { createServer } = require('node:http');
const { join } = require('node:path');
const cors = require('cors');
const express = require('express');
const { startCommunication } = require('./services/communicationService');
const config = require('./config/config');
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors:{
      origin:'*',
      optionsSuccessStatus:200
    }
  });

app.use(cors());
app.use(express.static(__dirname)); 
app.use(express.urlencoded({ extended: true })); // use express's built-in middleware
app.use(express.json()); // This is the middleware to handle JSON payloads

app.get('/', (req, res) => {
  res.status(200).send('<h1>Communication service is up!</h1>');
});

io.on('connection', async(socket) => {

    console.log('Communication socket connected: ', socket.id);
    await startCommunication(socket);

});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({ error: err.message });
});

server.listen(config.PORT, () => {
    console.log(`Communication service listening on port ${config.PORT}`);
});