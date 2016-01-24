express = require 'express'

app = express()
app.use express.static '../client'

server = app.listen 3000, ->
  console.log "Listening on port #{server.address().port}"

gracefulShutdown = ->
  console.log 'Received kill signal, shutting down gracefully...'
  server.close ->
    console.log 'All remaining connections closed'
    process.exit()

  setTimeout ->
    console.warn 'Could not close connections in time, force shut down'
    process.exit()
  , 1000

process.on 'SIGTERM', gracefulShutdown
process.on 'SIGINT', gracefulShutdown

mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost:27017/educraft'
#mongoose.connection.on 'open', (con) -> mongoose.connection.db.dropDatabase()
models = require('./models/models')(mongoose)

session = require 'express-session'
passport = require 'passport'
MongoStore = require('connect-mongo')(session)
bcrypt = require 'bcrypt'

config = require './config.json'

BdApiStrategy = require('passport-bdapi').Strategy
passport.use new BdApiStrategy {
    apiURL: config.oauth.apiUrl,
    clientID: config.oauth.clientId,
    clientSecret: config.oauth.clientSecret,
    callbackURL: config.oauth.callbackUrl
  }, (accessToken, refreshToken, profile, done) ->
    models.User.findOne { oauthId: "cf-#{profile.user_id}" }, (err, user) ->
      if user
        user.username = profile.username
        user.save (err) -> done(err, user)
      else
        models.User.create
          oauthId: "cf-#{profile.user_id}"
          username: profile.username
        .then (user) -> done(null, user)
        .then null, (err) -> done(err, null)

passport.serializeUser (user, done) -> done(null, user._id)

passport.deserializeUser (id, done) ->
  models.User.findById(id)
  .then (user) -> done(null, user)
  .then null, -> done(true, null)

app.use session
  secret: config.session.secret
  resave: false
  saveUninitialized: false
  cookie:
    path: '/'
    httpOnly: true
    secure: false
    maxAge: null
  store: new MongoStore
    mongooseConnection: mongoose.connection
    collection: 'sessions'

app.use passport.initialize()
app.use passport.session()
app.use require('body-parser').json()

app.use '/api', (req, res, next) ->
  if !req.user?
    res.status(401).end()
  else
    next()

app.get '/auth/craftenforum', passport.authenticate('oauth2', scope: 'read')
app.get '/auth/craftenforum/callback', passport.authenticate('oauth2', failureRedirect: '/'), (req, res) -> res.redirect('/')

app.get '/api/me', (req, res) -> res.json(req.user).end()

app.get '/api/modules', (req, res) ->
  res.json(req.user.snippets).end()

app.post '/api/modules', (req, res) ->
  if !req.user.snippets.find((s) -> s.name == req.body.name)?
    module = name: req.body.name, code: req.body.code, lastModified: new Date()
    req.user.snippets.push module
    req.user.markModified 'snippets'
    req.user.save()
    .then -> res.json(module).end()
    .then null, -> res.status(500).end()
  else
    res.status(409).end()

app.put '/api/modules/:module', (req, res) ->
  module = req.user.snippets.find (s) -> s.name == req.params.module
  renamedModule = req.user.snippets.find (s) -> s.name == req.body.name
  if module
    if !renamedModule? or module == renamedModule
      module.name = req.body.name
      module.code = req.body.code
      module.lastModified = new Date()
      req.user.markModified 'snippets'
      req.user.save()
      .then -> res.json(module).end()
      .then null, -> res.status(500).end()
    else
      res.status(409).end()
  else
    res.status(404).end()

app.delete '/api/modules/:module', (req, res) ->
  req.user.snippets = req.user.snippets.filter (s) -> s.name != req.params.module
  req.user.markModified 'snippets'
  req.user.save()
  .then -> res.status(204).end()
  .then null, -> res.status(500).end()

app.post '/logout', (req, res) ->
  req.logout()
  res.redirect '/'

app.get '/modules/:username/:module', (req, res) ->
  models.User.findOne(username: req.params.username)
  .then (user) ->
    if user?
      snippet = user.snippets.find (s) -> s.name == req.params.module

      if snippet
        res.set
          'Content-Type': 'text/x-lua'
          'Last-Modified': snippet.lastModified.toUTCString()
        res.send new Buffer """
-- #{req.params.username}/#{req.params.module}
-- Last modified: #{snippet.lastModified.toUTCString()}

#{snippet.code}
"""
      else
        res.status(404).send()
    else
      res.status(404).send()
  .then null, (err) ->
    console.log err
    res.status(500)