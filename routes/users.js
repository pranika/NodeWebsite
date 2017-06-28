var express = require('express');
var router = express.Router();
var multer = require('multer');
//Handle file upload
var upload=multer({dest:'./uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
  

var User=require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render("register");
});
router.get('/login', function(req, res, next) {
  res.render("login");
});
router.post('/register', upload.single('profileimage'), function (req, res, next) {
    var name =req.body.name;
    console.log(name);
    var email=req.body.email;
    var username=req.body.username;
    var password=req.body.password;
    var password2=req.body.password2;
    console.log(req.file);
    
    var profileimage='noimage.jpg';
    if(req.file) profileimage=req.file.filename;
        
    req.checkBody('name', 'Name Required').notEmpty();
    req.checkBody('email', 'Email Required').notEmpty();
    req.checkBody('email', 'Email is not Valid').isEmail();
    req.checkBody('username', 'UserName Required').notEmpty();
    req.checkBody('password', 'Password Required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if(errors){
        res.render('register',{errors:errors});
    }
    else{
        var newUser = new User({
            name:name,
            email:email,
            password:password,
            username:username,
            profileimage:profileimage
          
        });
    User.createUser(newUser,function(err,user){
        
        if(err) throw err;
        else
            console.log(user);
    });
        req.flash('success','Your are successfully registered and can login');
    res.location('/');
    res.redirect('/');
    }
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid Username and Password'}),
  function(req, res,next) {
    var username=req.body.username;
    var password=req.body.password;
    req.checkBody('username', 'UserName Required').notEmpty();
    req.checkBody('password', 'Password Required').notEmpty();
    var errors=req.validationErrors();
   if(errors){
        res.render('register',{errors:errors});
    }
    else{
    req.flash('success','You are now logged in ');
    res.redirect('/');
    }
    
  });
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user)
            { 
                return done(null, false, { message: 'Incorrect user.' });
            }
            if(username == ' ' && password == ' ')
            {return done(null,false,{message:'Please enter Username and Password'});
            }
            
        User.comparePassword(password,user.password,function(err,isMatch){
            
            if(err) throw done(err);
            if(isMatch)
                return done(null,user);
            else
                return done(null, false, { message: 'Wrong Password' });
                
        });
            
            
            return done(null, user);
        });
    }
));
router.get('/logout',function(req,res){
   
    req.logout();
    req.flash('success','You have successfully logout');
    res.redirect('/users/login');
    
});


module.exports = router;
