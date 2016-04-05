var mongoose = require('../mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  name:String,
  pwd:String,
  register:Date
});

var user = mongoose.model('User',userSchema);
module.exports = user;
