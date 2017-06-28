var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',checkAuthenticated,function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function checkAuthenticated(req,res,next)
{
    if(req.isAuthenticated()){return next();}
    res.redirect('/users/login');
    
}
module.exports = router;
