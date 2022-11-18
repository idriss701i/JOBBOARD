const User = require('../models/User.model');
var express = require('express');
var passport = require('passport');
var router = express.Router();
var authController = require('../controllers/auth.Controller');

router.post("/login", function(req, res, next) {
    authController.login(req, res, next);
});

router.post("/register", function (req, res) {
    authController.register(req, res);
});

router.post("/update-user", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    authController.updateUser(req, res, next);
});

router.delete("/delete-user/:id", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    authController.deleteUser(req, res, next);
});

router.get("/all-users", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    authController.getUsers(req, res, next);
})

router.get("/get-user", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    authController.getUser(req, res, next);
})

router.post("/update-one-user/", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    authController.updateOneUser(req, res, next);
})

router.get("/get-one-user/:id", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    authController.getOneUser(req, res, next);
})

router.post("/create-user", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    authController.createUser(req, res, next);
})



module.exports = router;