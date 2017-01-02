var express = require('express');
var router = express.Router();
var passport = require('passport');
var User= require('../models/user');

//GET ROUTES

/* GET TO HOME PAGE */
router.get('/', function(req, res) {
    res.render('index');
});

// GET TO SIGNUP PAGE
router.get('/signup', function (req,res) {
    res.render('signup');

});


//POST FOR SIGNUP

router.post('/signup', function (req,res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if(err){
            console.log(err);
            return res.render('signup');
        }
        passport.authenticate('local')(req,res, function () {
            res.redirect('/contacts/contactList');
            
        });
        
    });
    
});

//GET LOGIN PAGE

router.get('/login', function (req,res) {
    res.render('login');
});


//POST LOGIN
router.post('/login', passport.authenticate('local', {
    successRedirect: '/contacts/contactList',
    failureRedirect: '/signup'

}),
    function(req,res){

    });

// GET /logout
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



module.exports = router;
