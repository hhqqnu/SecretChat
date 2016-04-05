var express = require('express');
var User = require('../src/db/models/user');
var result = require('../src/utils/result');
var router = express.Router();
router.get('/',function(req,res,next){
  res.render('login.html');
});
router.post('/',function(req,res,next){
  var r = result();
  if(!req.body.userName || !req.body.userPwd){
    r.error = '用户名或密码不能为空';
    return res.json(r);
  }
  var u = new User({
    name:req.body.userName,
    pwd:req.body.userPwd
  });
  User.find(u,function(err,doc){
    if(err){
      r.error = '用户名或密码不正确';
      return;
    }
    req.session.userid = u.name;
    res.json(r);
  });
});
module.exports = router;
