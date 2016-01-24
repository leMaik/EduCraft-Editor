module.exports = (mongoose) ->
  snippet =
    name:
      type: String
      required: true
    code:
      type: String
      required: true
    lastModified:
      type: Date

  userSchema = mongoose.Schema
    oauthId:
      type: String
      unique: true
      required: true
    username:
      type: String
      required: true
    snippets: [snippet]

  mongoose.model 'User', userSchema
