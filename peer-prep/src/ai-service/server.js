const express = require('express');
const app = express();
const config = require('./config/config');
const routes = require('./routes/gptRoute');

app.use(express.urlencoded({ extended: true })); // use express's built-in middleware
app.use(express.json()); // This is the middleware to handle JSON payloads

app.use('/', routes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({ error: err.message });
});

app.listen(3004, () => {
    console.log('AI service listening on port 3004');
});

module.exports = app;   