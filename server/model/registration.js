const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const Registration = new Schema({
    role: {type: String, default: 'user'},
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});

module.exports = mongoose.model('register', Registration);
