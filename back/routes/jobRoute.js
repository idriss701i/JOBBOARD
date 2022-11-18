const User = require('../models/User.model');
var express = require('express');
var passport = require('passport');
var router = express.Router();
const { createJob, getJob, getJobs, updateJob, deleteJob, getAllJobs } = require('../controllers/job.controller');

router.post('/create-job', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    createJob(req, res, next);
});

router.patch('/update-job/:id', passport.authenticate('jwt', { session: false }), function(req, res, next) {   
    updateJob(req, res, next);
});

router.delete('/delete-job/:id', passport.authenticate('jwt', { session: false }), function(req, res, next) {   
    deleteJob(req, res, next);
});

router.get('/get-job/:id', function(req, res, next) {
    getJob(req, res, next);
});

router.get('/get-jobs', function(req, res, next) {
    getJobs(req, res, next);
});

router.get("/get-all-jobs", function (req, res) {
    getAllJobs(req, res);
})

module.exports = router;