var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var moment = require("moment");
var session = require('express-session');
var expressValidator = require("express-validator");
var mongoose = require("mongoose");
var flash    = require('connect-flash');
var passport    = require("passport");



var url = "mongodb://localhost:27017/votingapp";



// Connect to MongoDB.
mongoose.connect(url, (err) => {
  if(err) {
    console.log(err)
  }

  console.log("Connected to mongodb..")
})


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pollsRouter = require('./routes/polls');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false} ));
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

// Express-session.
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'my secret word' }
));


// Initialize passport.
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session





app.use('/users', usersRouter);
app.use('/polls', pollsRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
