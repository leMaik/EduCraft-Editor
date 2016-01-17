express = require 'express'

app = express()
app.use express.static '../client/dist'

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
models = require('./models/models')(mongoose)

session = require 'express-session'
passport = require 'passport'
MongoStore = require('connect-mongo')(session)
bcrypt = require 'bcrypt'

LocalStrategy = require('passport-local').Strategy
passport.use new LocalStrategy {
  usernameField: 'username'
  passwordField: 'password'
}, (username, password, done) ->
  models.User.findOne(email: username)
  .then (user) ->
    if user?
      bcrypt.compare password, user.hash, (err, same) ->
        if !err and same
          done(null, user)
        else
          done(null, false)
    else
      done(null, false)
  .catch -> done(null, false)

passport.serializeUser (user, done) -> done(null, user._id)

passport.deserializeUser (id, done) ->
  models.User.findById(id)
  .then (user) -> done(null, user)
  .catch -> done(null, false)

app.use session
  secret: process.env.SECRET
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

app.use '/api', (req, res, next) ->
  if !req.user?
    res.status(401).end()
  else
    next()

app.post '/register', (req, res) ->
  models.User.register new models.User(username: req.body.username), req.body.password, (err, account) ->
    if (err)
      res.status(500).send('Registration failed')
    else
      passport.authenticate('local')(req, res, -> res.redirect('/'))

app.post '/login', passport.authenticate('local'), (req, res) ->
  res.redirect '/'

app.post '/logout', (req, res) ->
  req.logout()
  req.redirect '/'

app.get '/modules/:username/:module', (req, res) ->
  models.User.findOne(username: req.params.username)
  .then (user) ->
    if user?
      snippet = user.snippets.find (s) -> s.name == req.params.module

      if snippet
        res.set 'Content-Type', 'text/plain'
        res.send new Buffer """
-- #{req.params.user}/#{req.params.module}
-- Retrieved on: #{new Date().toISOString()}

#{snippet.code}
"""
      else
        res.status(404).send()
    else
      res.status(404).send()
  , (err) ->
    console.log err
    res.status(500)