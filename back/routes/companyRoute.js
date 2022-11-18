var express = require("express");
var router = express.Router();
var companyController = require("../controllers/company.Controller");
var auth = require("../middleware/auth")();
var Company = require('../models/Companies.model');
var passport = require('passport');
var { body, validationResult } = require('express-validator');


router.get("/get-companies", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    companyController.getCompanies(req, res, next);
});

router.delete("/delete-company/:id", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    companyController.deleteCompany(req, res, next);
});

router.post("/create-company", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    companyController.createCompany(req, res, next);
})

router.get("/get-one-company/:id", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    companyController.getOneCompany(req, res, next);
})

router.patch("/update-one-company/:id", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    console.log(req.params.id)
    companyController.updateCompany(req, res, next);
})

module.exports = router;