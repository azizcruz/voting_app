const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment"); // This middle ware deals with dates.

// Function to get today date.
function todayDate() {
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

today = dd + '/' + mm + '/' + yyyy;
return today;
}


const createPoll = new Schema({
    pollId: Schema.ObjectId,
    userId: {
        type: String,
        required: true
    }
    ,
    pollQuest: {
        type: String,
        required: true
    },

    pollChoices: {
        type: Object,
        required: true
    },

    voters: {
        type: Array
    }
    ,
    datecreated: {
        type: String,
        default: todayDate()
    }

})



module.exports = mongoose.model('polls', createPoll);