module.exports = (mongoose) ->
  model = (name) -> require('./' + name)(mongoose)

  User: model 'user'
