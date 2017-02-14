var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
// var passportLocalMongoose = require('passport-local-mongoose');


//ROUTES
var index = require('./routes/index');
var contacts = require('./routes/contacts');

var app = express();

// Connect to database
// mongoose.connect('mongodb://localhost/contactbook');
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
}
else {
    mongoose.connect('mongodb://localhost/contactbook');
}
mongoose.connection.on('error', function(err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);
mongoose.connection.once('open', function() {
    console.log("Mongoose has connected to MongoDB!");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


//PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'I love cats too',
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new LocalStrategy({
//         usernameField: 'email'
//     },
//     function(username, password, done) {
//         User.findOne({ email: username }, function (err, user) {
//             if (err) { return done(err); }
//             // Return if user not found in database
//             if (!user) {
//                 return done(null, false, {
//                     message: 'User not found'
//                 });
//             }
//             // Return if password is wrong
//             if (!user.validPassword(password)) {
//                 return done(null, false, {
//                     message: 'Password is wrong'
//                 });
//             }
//             // If credentials are correct, return the user object
//             return done(null, user);
//         });
//     }
// ));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// This middleware will allow us to use the currentUser in our views and routes.
app.use(function (req, res, next) {
    global.currentUser = req.user;
    global.message = req.flash('error');
    next();
});

//Routes
app.use('/', index);
app.use('/contacts', contacts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log('Running in %s mode', app.get('env'));


module.exports = app;
