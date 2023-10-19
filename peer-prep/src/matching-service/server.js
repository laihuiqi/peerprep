const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/config');
const routes = require('./routes/matchingRoute');


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

app.use(express.urlencoded({ extended: true })); // use express's built-in middleware
app.use(express.json()); // This is the middleware to handle JSON payloads

app.use('/', routes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({ error: err.message });
});

app.listen(3001, () => {
    console.log('Matching service listening on port 3001');
});

module.exports = { connectDB };