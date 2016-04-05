var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.dbPath);
module.exports = mongoose;
