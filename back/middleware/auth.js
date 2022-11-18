var passport = require("passport");
var passportJWT = require("passport-jwt");
var User = require("../models/User.model");
var config = require("config");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: config.get("jwtToken"),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt")
};

module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {
      var user = User.findById(payload.id, function(err, user) {
        if (err) {
          return done(new Error("UserNotFound"), null);
        } else if(payload.expire<=Date.now()) {
          return done(new Error("TokenExpired"), null);
        } else{
          return done(null, user);
        }
      });
    });
    passport.use(strategy);
    return {
      initialize: function() {
        return passport.initialize();
      },
      authenticate: function() {
        return passport.authenticate("jwt", config.get("jwtSession"));
      }
    };
};