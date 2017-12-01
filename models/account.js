var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var randToken = require('rand-token');

var Account = new Schema({
    username: {type: String, unique:true},
    password: String,
    csrfToken: {type: String, default: function() {
        return randToken.generate(16);
    }}
});



Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);