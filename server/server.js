"use strict";

const config = {
    port: process.env.PORT || 3000,
    mongodb: process.env.DB_PORT ? process.env.DB_PORT.replace('tcp', 'mongodb') + '/educraft' : process.env.MONGO_URL,
    oauth: {
        apiUrl: process.env.API_URL,
        clientId: process.env.API_CLIENT_ID,
        clientSecret: process.env.API_CLIENT_SECRET,
        callbackUrl: process.env.API_CALLBACK_URL
    },
    session: {
        secret: process.env.API_SESSION_SECRET
    }
};

const mongoose = require('mongoose');
mongoose.connect(config.mongodb);
const models = require('./models/models')(mongoose);

const passport = require('passport');
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => {
    return models.User.findById(id)
        .then(user => done(null, user))
        .then(null, err => done(err, null))
});

const express = require('express');
const app = express();

app.use(require('./sessionstore')(config.session, mongoose.connection));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('body-parser').json());
app.use(express.static('../client'));
require('./api')(app, models);

//authorization methods
require('./auth/craftenforum')(config.oauth, app, passport, models);

const server = app.listen(config.port, function () {
    console.log(`Listening on port ${this.address().port}`);
});

process.on('SIGTERM', () => {
    console.log('Received kill signal, shutting down gracefully...');
    server.close(() => {
        console.log('All remaining connections closed');
        mongoose.connection.close();
        process.exit();
    });

    setTimeout(() => {
        console.warn('Could not close connections in time, force shut down');
        process.exit(1);
    }, 30 * 1000);
});