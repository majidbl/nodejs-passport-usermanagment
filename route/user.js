var express = require('express');
var router = express.Router();
var db = require('../model')
const Nuser = require('../model');
const passport = require('passport');
const {islogged, loggin} = require('../config/auth');
const calcAge = require("../util/calcAge")

router.get('/', islogged, function(req, res){
  if(req.user.role == 'admin'){
    Nuser.findAll().then((data) =>
    {
      var jusers = JSON.stringify(data);
      var users = JSON.parse(jusers);

      var err = [];
      err.push({type:"success",ms:"partial work correctly"});
      err.push({type:"danger",ms:"Test partial with other data"})
      err.push({type:"success",ms:"Well come To Administer Profile Page"})
      res.render('dashboard', 
      {users:users,msg:err});
    });
  }else if(req.user.role == 'member'){
    Nuser.findOne({where:{id:req.user.id}}).then((data) =>
    {
      var jusers = JSON.stringify(data);
      var users = JSON.parse(jusers);
      var err = [];
      err.push({type:"success",ms:"partial work correctly"});
      err.push({type:"danger",ms:"Test partial with other data"})
      err.push({type:"success",ms:"Well come To your Profile Page"})
      res.render('profile', 
      {users:users,msg:err});
    });
    
  }
});

router.get('/dashboard/user/:id', islogged, function(req, res){
    Nuser.findOne({where:{id:req.params.id}}).then((data) =>
    {
      if(req.user.role == 'admin'){
      var jusers = JSON.stringify(data);
      var users = JSON.parse(jusers);
      var err = [];
      err.push({type:"success",ms:`Well come To ${data.username} Profile Page`})
      res.render('profile', 
      {users:users,msg:err});
  }else if(req.user.role == 'member'){
      var err = [];
      err.push({type:"danger",ms:"Only admin can Access to Member Profile. Please login as Admin"});
      res.render('login', 
      {users:users,msg:err});
  }
    });
});
router.get('/login', function(req, res){
   res.render('login');
});

router.post('/login', (req, res, next) =>{
  passport.authenticate('local', {
        failureRedirect: '/users/login',
        successRedirect: '/users',
        failureFlash: true
  })(req, res, next);
});

router.all('/register',function(req, res){
   if (req.method == "POST")
   {
     var errors = [];
     var username = req.body.username;
     fathername = req.body.fathername;
     email = req.body.email;
     identitynumber = req.body.identitynumber;
     year = req.body.year;
     month = req.body.month;
     day = req.body.day;
     if (parseInt(month) > 12)  {
       errors.push({type:"danger",
                    ms:"Month of Year is Invalid"});
     }
     if (parseInt(day) > 30 ) {
       errors.push({type:"danger",
                    ms:"Day of Year is Invalid"});
     }
     password = req.body.password;
     gen = req.body.gen;
     birthday = new Date(year + "/" + month + "/" + day);
     age = calcAge(birthday);
     console.log(age);
     Nuser.count({where:{identitynumber:identitynumber}}).then((count) => {
       if(count>0){
         console.log(count);
         errors.push({type:"danger",
           ms:"A User With same Identity Number is Registered"
         });
         res.render("register", {msg:errors});
       }else{
         
     console.log(errors.length)
     if (errors.length > 0) {
       res.render("register", {msg:errors});
     }else{
       Nuser.create({
           username:username,
           fathername:fathername,
           email:email,
           identitynumber:identitynumber,
           gender:gen,
           birthday:birthday,
           age:age,
           password:password
         }).then( () => { 
           console.log("new user inserted");
           req.session.sessionFlash = {
             type: 'success',
             message: ` ${username}  successfully created!!!!.`
           };
             res.redirect("/");
         }).catch(err =>{ 
           req.session.sessionFlash = {type: 'danger',
           message: ` $create {username}   failure. please contact to admin`
        };
          console.error('Error executing query', err.stack);
        }
      );
    }
       }
     })
   }else{
     res.render('register');
   }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
           req.session.sessionFlash = {type: 'success',
           message: 'You are logged out'
        };
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//export this router to use in our index.js
module.exports = router;