var express = require('express');
var router = express.Router();
router.get('/',function(req,res,next){
  if(req.session.userid){
    delete req.session.userid;
  }
  res.redirect('/login');
});
module.exports = router;
