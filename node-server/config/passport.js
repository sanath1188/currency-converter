/**
 * @fileOverview Passport configuration; exports the actual passport object.
 */

var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var sha1 = require('sha1');

/** @todo Serialize properly */
passport.serializeUser(function (user, next) {
    console.log("serializing user...");

    next(null, user.id); // Serialize user by id.

    console.log("serialized user");
});

passport.deserializeUser(function (id, next) {
    // console.prog("deserializing user...");

    User.findOne({
        where: { id: id }
    }).then(function (user) {
        next(null, user);

        // console.log("deserialized user");
    }, function (err) {
        next(err);
    });
});

passport.use(new LocalStrategy({
    /** Override default fields. */
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, next) {
    console.log("using local strategy...");

    if (email === "hashLogin") {
        User.findOne({
            where: {
                password: password
            }
        }).then(function (user) {
            console.log("Found user found with the password " + user.password + " for hash login.");
            if (!user) {
                next(null, false, {
                    message: "Invalid email link"
                });
            } else {
                console.log("Found user " + user.id + " for hash login.");
                next(null, user);
            }
        }, function (err) {
            console.log(err);
            next(null, false, {
                message: err
            });
        });
    } else {
        User.findOne({
            where: { email: email }
        }).then(function (user) {
            if (!user) {
                console.log("No user found with an email of " + email);
                next(null, false, {
                    message: "Invalid email"
                });
            } else if (bcrypt.compareSync(password, user.hash)) {
                next(null, user);
            } else if ((password.length >= 32 && password === user.pw_reset_slug) || (password === user.password)) { // Successful authentication.
                console.log("User authenticated - id " + user.id);
                if (user.pw_reset_slug) { // User is logging in for the first time after forgetting their password.
                    user.update({
                        pw_reset_slug: null
                    }).then(function () {
                        next(null, user);
                    }, function (err) {
                        console.err("failed to delete password reset slug for user: " + user.id);
                        console.err(err);

                        next(null, false, {
                            message: "Failed to delete password reset slug."
                        });
                    });
                } else { // Regular login.
                    next(null, user);
                }
            } else {
                console.log("User password incorrect.")
                next(null, false, {
                    message: "Invalid password."
                });
            }
        }, function (err) {
            console.log(err);
            next(null, false, {
                message: err
            });
        });
    }
}));

module.exports = passport;
