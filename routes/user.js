var express = require('express');
var router = express.Router();
var User = require('../src/db/models/user');
var result = require('../src/utils/result');

router.get('/register',function(req,res,next){
  res.render('register.html');
});
router.post('/register',function(req,res,next){
  var r = result();
  var u = req.body.username;
  var p = req.body.password;
  if(!u || !p){
    r.error = '用户名或密码不能为空！';
    return res.json(r);
  }
  var u = new User({
    name:u,
    pwd:p,
    register:Date.now() 
  });
  u.save(function(err,doc){
    if(err){
      r.error = err;
    }else{
      r.data = 'ok';
    }
    return res.json(r);
  });
});

module.exports = router;
