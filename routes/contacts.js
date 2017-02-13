var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Contact = require('../models/contact');

/* GET CONTACT FORM// NEW */

router.get('/contactForm', isLoggedIn, function (req, res, next) {
    res.render('contacts/contactForm');
});

//SHOW USERS CONTACT LIST // INDEX

router.get('/contactList', isLoggedIn, function (req, res, next) {

    Contact.find({user: currentUser}, function (err, allContacts) {
        console.log(allContacts);
        console.log(allContacts.user);
        console.log(currentUser._id);

        if (err) {
            return next(err);
        }
        else  (allContacts && allContacts.user && allContacts.user.equals(currentUser._id))

        res.render('contacts/contactList', {contacts : allContacts,     currentUser: req.user});

    });

});

//POSTING ROUTES

//get data from contactForm and add database/ CREATE
router.post('/', isLoggedIn, function (req, res, next) {
    console.log('req.body:', req.body);
    var newContact = {
        firstName : req.body.firstName,
        lastName: req.body.lastName,
        meetingPlace: req.body.meetingPlace,
        phoneNumber: req.body.phoneNumber,
        email:  req.body.email,
        dateMet:req.body.dateMet,
        url: req.body.url,
        workPlace:  req.body.workPlace,
        positionThere: req.body.positionThere,
        positionsInterestedIn: req.body.positionsInterestedIn,
        user: currentUser
    };
    Contact.create(newContact, function (err, savedContact) {
        if (err){
            return next(err);
        } else {
            console.log('savedContact:', savedContact);
            res.redirect('/contacts/contactList')
        }
    });
});

// THIS WILL SHOW THE CONTACT INFO FOR CONTACT RECORDED //SHOW
router.get('/contactList/:id', isLoggedIn, function (req, res, next){

    Contact.findById(req.params.id, function (err, foundContact) {
        if(err) {
            return next(err);
        } else {
            res.render('contacts/show1contact', {contact : foundContact});
        }
    });
});


//EDIT ROUTE

router.get('/contactList/:id/contactEdit', isLoggedIn, function (req, res,next){
    Contact.findById(req.params.id, function (err, foundContact){
        if(err) {
            return next(err);
        } else {
            res.render('contacts/contactEdit', {contact : foundContact});
        }
    });

});


//UPDATE ROUTE
router.put('/contactList/:id', isLoggedIn, function (req,res,next){
    console.log('req.body:', req.body);//removed .contact because trying to reach body of the form.
    Contact.findByIdAndUpdate(req.params.id, req.body, function(err, updatedContact) {
        if(err) {
            return next(err);
        } else {
            console.log('saved updated contact:', updatedContact);
            res.redirect('/contacts/contactList/' + req.params.id);
        }
    })
});

//DELETE ROUTE
router.delete('/contactList/:id', isLoggedIn, function(req,res,next){
    console.log('Trying to delete contact with id:', req.params.id);// test to see if showing up in terminal
    Contact.findByIdAndRemove(req.params.id, function(err) {

        if(err){
            return next(err);
        } else {
            res.redirect('/contacts/contactList')
        }
    })
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please Login First!')
    res.redirect('/login');
}
module.exports = router;