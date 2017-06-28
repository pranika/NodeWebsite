var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    res.render('blog',{title:'Blog'});
});
router.get('/home',function(req,res,next){
    res.render('home',{title:'Blog'});
});
router.get('/addPost',function(req,res,next){
    res.render('addPost',{title:'Add Post'});
    next();
});
router.get('/addCategory',function(req,res,next){
    res.render('addCategory',{title:'Add Category'});
    next();
});
module.exports = router;
