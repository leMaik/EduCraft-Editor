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
    username: String
    password: String
    snippets: [snippet]

  userSchema.plugin passportLocalMongoose

  mongoose.model 'User', userSchema
