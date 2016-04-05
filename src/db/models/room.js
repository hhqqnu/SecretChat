var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roomScheam = new Schema({
  roomName:String,
  roomContent:String,
  roomCreateDate:Date,
  roomImg:String,
  roomCreateUser:String,
  roomJoinPeos:Number
});

var room = mongoose.model('Room',roomScheam);
module.exports = room;
