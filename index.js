const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const env = require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function(){
    console.log('Connected!');
});

const app = express();

app.use(express.json());

// Routes
app.use('/users', usersRoute);
app.listen(3000);

module.exports = app;