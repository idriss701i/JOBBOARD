const User = require('../models/User.model');
var express = require('express');
var passport = require('passport');
var router = express.Router();
var applyController = require('../controllers/apply.Controller');

router.post("/apply", function(req, res, next) {
    applyController.apply(req, res, next);
});

router.get("/get-applies", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    applyController.getApplies(req, res, next);
})

router.get("/get-apply/:id", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    applyController.getApply(req, res, next);
})

router.post("/update-apply", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    applyController.updateApply(req, res, next);
})

router.delete("/delete-apply/:id", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    applyController.deleteApply(req, res, next);
})

router.post("/create-apply", function(req, res, next) {
    applyController.createApply(req, res, next);
})

module.exports = router;