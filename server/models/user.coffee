passportLocalMongoose = require 'passport-local-mongoose'

module.exports = (mongoose) ->
  snippet =
    name:
      type: String
      unique: true
      required: true
    code:
      type: String
      required: true

  userSchema = mongoose.Schema
    oauthId: String
    username: String
    snippets: [snippet]

  mongoose.model 'User', userSchema
