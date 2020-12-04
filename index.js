const express = require('express');
const mongoose = require('mongoose');

const usersRoute = require('./routes/users');
const sessionsRoute = require('./routes/sessions');
const User = require('./models/User');
const env = require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('docs/swagger.yaml');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function(){
    console.log('Connected!');
});

const app = express();

app.use(express.json());

// Run middlewares
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/users', usersRoute);
app.use('/sessions', sessionsRoute);
app.listen(3000);

module.exports = app;