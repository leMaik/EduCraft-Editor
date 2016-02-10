module.exports = (mongoose) ->
  snippet =
    name:
      type: String
      required: true
    code:
      type: String
      required: false
    lastModified:
      type: Date

  userSchema = mongoose.Schema
    oauthId:
      type: String
      unique: true
      required: true
    username:
      type: String
      unique: true
      required: true
    snippets: [snippet]

  mongoose.model 'User', userSchema
