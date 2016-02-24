"use strict";

const config = {
    port: process.env.PORT || 3000,
    mongodb: process.env.DB_PORT ? process.env.DB_PORT.replace('tcp', 'mongodb') + '/educraft' : process.env.MONGODB,
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
passport.serializeUser((user, done) =>
    done(null, user._id)
);
passport.deserializeUser((id, user) =>
    models.User.findById(id)
        .then(user=>done(null, user)
            .then(null, err=>done(err, null)))
);

const express = require('express');
const app = express();

app.use(express.static('../client'));
app.use(require('body-parser').json());
app.use(require('./auth/craftenforum')(config.oauth, app, passport, models));
require('./api')(app, models);

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

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