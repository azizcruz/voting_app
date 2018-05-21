const mongoose = require('mongoose');   
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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

const createUser = new Schema({
    userId: Schema.ObjectId,
    name: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    registeredDate: {
        type: String,
        default: todayDate()
    }
});

module.exports = mongoose.model('users', createUser);

module.exports.checkPassword = function(password, hashedPassword, callback) {
    return bcrypt.compareSync(password, hashedPassword)
}