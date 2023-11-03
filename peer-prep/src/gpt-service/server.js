const express = require('express');
const app = express();
const config = require('./config/config');
require('dotenv').config();
const routes = require('./routes/gptRoute');

app.use(express.urlencoded({ extended: true })); // use express's built-in middleware
app.use(express.json()); // This is the middleware to handle JSON payloads

app.use('/', routes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({ error: err.message });
});

app.listen(config.PORT, () => {
    console.log(`GPT service listening on port ${config.PORT}`);
});

module.exports = app;   