const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = (config, connection) => {
    return session({
        secret: config.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: null
        },
        store: new MongoStore({
            mongooseConnection: connection,
            collection: 'sessions'
        })
    });
};