var express     = require('express');
var router      = express.Router();
var createUser  = require('./../modules/createUser');
var bcrypt      = require('bcrypt');
var LocalStrategy = require("passport-local").Strategy;
const {check, validationResult} = require('express-validator/check');
var passport    = require("passport");
var flash    = require('connect-flash');

// Configure bcrypt.
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';



// GET-----> GET sign up page.
router.get('/signup', function (req, res, next) {
  res.render('signup', {title: 'signup'})
});

// GET sign in page.
router.get('/signin', function (req, res, next) {
  res.render('signin', {title: 'signin', message: req.flash('loginMessage')})
});

// GET profile page.
router.get('/profile', isLoggedIn ,function (req, res, next) {
  
  req.session.email   = req.user.email
  req.session.userId  = req.user._id

  res.render('profile', {email: req.user.email, name: req.user.name, userID: req.user._id})
})

// GET logout page.
router.get('/logout', function(req, res){
  req.logout();
  res.render('index', {logout: "You logged out"});
});

// POST-----> 

// Serialize user.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize use.
passport.deserializeUser(function(id, done) {
  createUser.findById(id, function(err, user) {
    done(err, user);
  });
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect("/")
}

// Configure passport local.
passport.use(new LocalStrategy({

  usernameField: 'email',
  passwordField: 'pass',
  passReqToCallback: true

},
  function(req, email, password, done) {
    createUser.findOne({"email": email}, function(err, doc) {
      if(err) return done(err);

      if(!doc) {
        return done(null, false, req.flash('loginMessage', 'This user is not registered with us.'));
      }

      if(!createUser.checkPassword(password, doc.password)) {
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }

      return done(null, doc)
    })

  }
));



// POST sign in form.
router.post('/signin', passport.authenticate('local', {
  successRedirect : '/users/profile', // redirect to the secure profile section
  failureRedirect : '/users/signin', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}))

// POST sign up form.
router.post('/signup', (req, res, next) => {

  // Validate inputs.
  req
    .checkBody('name')
    .trim()
    .notEmpty()
    .withMessage('Name must be a filled');
  req
    .checkBody('email')
    .trim()
    .isEmail()
    .withMessage('Must be an email');
  req
    .checkBody('pass1')
    .trim()
    .notEmpty()
    .withMessage('Password must be filled')
  req
    .checkBody('pass2')
    .trim()
    .notEmpty()
    .withMessage('Re password Must be filled');
  req
    .checkBody('pass1')
    .trim()
    .isLength({min: 4})
    .withMessage('Password must contain at least 4 chars');

  var errors = req.validationErrors();

  createUser.findOne({email: req.body.email}, {$exsits: true}).then((data) => {
    if(data) {
      res.render('signup',{error: "This email exists in our database"})
    } else {
      
    }
  })

  if (errors.length > 0) {
    res.render('signup', {
      success: '',
      errors: errors
    });
  } else {
    var name = req.body.name,
      email = req.body.email,
      pass1 = req.body.pass1,
      pass2 = req.body.pass2;

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(pass1, salt, (err, hash) => {

        bcrypt.compare(pass2, hash, (err, result) => {

          if (result) {
            var data = new createUser({name: name, email: email, password: hash})

            data.save((err) => {
              if (err) {
                throw err;
              }
              res.render('signup', {success: "Thank you for registering with us"})
            })
          } else {

            res.render('signup', {error: "Passwords do not match"})

          }

        })

      })
    })

  }

})

// POST check if email exist in db using ajax.
router.post('/checkEmail', (req, res, next) => {
  var checkEmail = req.body.checkEmail;
  
  createUser.findOne({email: checkEmail}, {$exsits: true}).then((data) => {
    if(data) {
      res.json({msg: "This email exists in our database"})
    } else {
      res.json({msg: "OK"});
    }
  })
})
module.exports = router;
