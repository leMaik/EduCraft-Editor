module.exports = (mongoose) ->
  snippet =
    name:
      type: String
      unique: true
      required: true
    code:
      type: String
      required: true
    lastModified:
      type: Date

  userSchema = mongoose.Schema
    oauthId: String
    username: String
    snippets: [snippet]

  mongoose.model 'User', userSchema
