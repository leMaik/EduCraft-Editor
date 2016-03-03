"use strict";

const passport = require('passport');
const BdApiStrategy = require('passport-bdapi').Strategy;

module.exports = (config, app, passport, models) => {
    passport.use(new BdApiStrategy({
        apiURL: config.apiUrl,
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackUrl
    }, (accessToken, refreshToken, profile, done) => {
        models.User.findOne({oauthId: `cf-${profile.user_id}`}, (err, user) => {
            if (user) {
                user.username = profile.username;
                user.save(err => done(err, user));
            }
            else {
                models.User.create({
                        oauthId: "cf-#{profile.user_id}",
                        username: profile.username
                    })
                    .then(user => done(null, user))
                    .then(null, err => done(err, null));
            }
        });
    }));

    app.get('/auth/craftenforum',
        passport.authenticate('oauth2', {scope: 'read'})
    );
    app.get('/auth/craftenforum/callback',
        passport.authenticate('oauth2', {failureRedirect: '/'}),
        (req, res) => res.redirect('/')
    );
};