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
  , 10 * 1000

process.on 'SIGTERM', gracefulShutdown
process.on 'SIGINT', gracefulShutdown