var express = require('express');
var router = express.Router();
var Poll = require("../modules/polls");
var requestIP = require('request-ip')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect("/")
}


/* GET polls listing. */
router.get('/allpolls', function(req, res, next) {

  Poll.find({}, (err, data) => {
    if(err) 
    throw err;
    console.log(data)
    res.render('polls', { title:'polls', data: data})
  })

  
});

// GET create poll page.
router.get('/createPoll', isLoggedIn, function(req, res, next) {
    res.render('createpoll', { title: 'Create Poll' });
})

// GET poll details on page.
router.get('/showPoll/:pollId', function(req, res, next) {
   var pollId = req.params.pollId

   Poll.findOne({_id: pollId}, (err, poll) => {
    var choices = []

    // Get choices into an array.
    for(choice in poll.pollChoices) {
      choices.push(choice)
    }
  
    res.render('showPoll', {poll: poll, choices: choices, id: pollId})
   })

   
})

// GET my polls page.
router.get("/allpolls/:userID", (req, res, next) => {
  var userID = req.params.userID

  Poll.find({userId: userID}, (err, data) => {
    if(err) 
    throw err;

    res.render('polls', {title: 'My Polls', userID: userID, user: req.session.email, data: data})
  })
  
})


// DELETE poll. 
router.get('/deletePoll/:pollId', isLoggedIn,(req, res, next) => {
  var pollId = req.params.pollId

  Poll.remove({_id: pollId}, (err, result) => {
    if(err)
    throw err;

    res.render('profile',{msg: "Poll was deleted successfully !"})
  })
})


// POST rourtes ---------->

router.post('/createPoll', isLoggedIn,(req, res, next) => {
  var choices = []
  var errors = []
  var choicesObject = {}
  var data = req.body

  // Check poll question.
  req.checkBody('pollquest').trim().notEmpty().withMessage("Poll question can't be empty !")
  if(req.body.pollquest.indexOf("$") > -1){
    errors.push("Only words and characters are accepted")
  }

  var errorMessages = req.validationErrors()

  if(errorMessages) {
      res.render('createpoll', {errors: errorMessages});
  } else {
    // Just continue...
  }


  // Push choices to an array.
  for(var ch in data) {
    if(ch.substring(0, 7) == "pollcho") {
      choices.push(data[ch])
    }

  }

  

  // Gather choices from array to an object.
  choices.forEach((choice) => {
    choicesObject[choice] = 0
  })
  

// Check choices values.
  for(var i = 0; i < choices.length; i++) {

    if(choices.indexOf("$") == -1 ) 
    continue
    else {
      errors.push("Only words and characters are accepted")
    }

  }

  if(errors.length > 0) {

    res.render('createpoll', {errors: errors[0]})

  } else {
  
    var pollData = {
      userId: req.session.userId,
      pollQuest: req.body.pollquest,
      pollChoices: choicesObject
    }

    var newPoll = new Poll(pollData)

    newPoll.save((err) => {
      if(err) throw err

      res.render('createPoll', {success: "You have created a poll successfully"})
    })
  }

 

  

})

// POST vote.
router.post('/vote', (req, res, next) => {
var ip = requestIP.getClientIp(req)
var userVote = req.body.vote
var pollId = req.body.pollID




// Get document according to his ID
Poll.findOne({_id: pollId}, (err, doc) => {

  // Get the poll choices object.
  var newData = doc.pollChoices
  var voters = doc.voters

  // Check if user already voted.
  if(voters.includes(ip)) {
    res.json({msg: "You already voted"})
  } else {
    // Save the user IP who voted into voters object.
    voters.push(ip)

    // Iterate through poll choices object and check if it is like what the user voted for.
  for(var val in newData) {
    if(val == userVote) {

      // Increase iy by one.
      newData[val] += 1
    }
  }

  // Update the poll object with the new data.
  Poll.updateOne({_id: pollId}, {$set: {
    voters: voters,
    pollChoices: newData
  }},

  {upsert: true, new: true},

  (err, response) => {

    res.json({msg: "Thank you for voting"})

  })
  }
})

})


module.exports = router;    