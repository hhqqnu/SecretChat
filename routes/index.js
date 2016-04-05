var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var express = require('express');
var multer = require('multer');
var Room = require('../src/db/models/room');
var upload = multer({ dest: 'uploads/' });
var result = require('../src/utils/result');
var router = express.Router();
router.get('/',function(req,res,next){
  if(req.session.userid){
    return next();
  }
  res.redirect('/login');
});
router.get('/',function(req,res,next){
  res.render('index.html',{userid:req.session.userid});
});

router.post('/room', function(req, res){
  console.log(req.body);
  var rs = result();
  if(!req.body.roomName){
    rs.error = '房间名称不能为空！';
    return res.json(rs);
  }
  var userid = req.session.userid;
  var r = new Room({
    roomName:req.body.roomName,
    roomContent:req.body.roomContent,
    roomCreateUser:userid,
    roomImg:'',
    roomCreateDate:Date.now(),
    roomJoinPeos:0
  });
  r.save(function(err,doc){
    if(err){
      rs.error = err;
    }else{
      rs.data = doc;
    }
    res.json(rs);
  });
 /*
 var userid = req.session.userid;
  var roomTitle = req.body.roomTitle;
  var roomContent = req.body.roomContent;
  var r = new Room({
    roomName:roomTitle,
    roomContent:roomContent,
    roomCreateUser:userid,
    roomImg:'',
    roomCreateDate:Date.now(),
    roomJoinPeos:0
  });
 r.save(function(err,doc){
    if(err){
      console.error(err);
    }
    console.log(doc);
    res.redirect('/');
  });
 */
});
router.get('/list',function(req,res,next){
  var rs = result();
  Room.find(function(err,docs){
    rs.error = err;
    rs.data = docs;
    res.json(rs);
  });
});

module.exports = router;
