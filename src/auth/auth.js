const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')

const intialize = (passport)=>{
    passport.use(new LocalStrategy({
        usernameField: 'email'
        },
        function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'There is no account with this email.' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: `Email and password doesn't match.` });
            }
            return done(null, user);
        });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        done(err, user);
        });
    });
}

module.exports = intialize