const express = require('express'), 
User = require('../models/User.model'),
config = require('config'),
jwt = require("jwt-simple"), 
bcrypt = require("bcrypt"),
emailjs = require('@emailjs/browser');
const Company = require('../models/Companies.model'), 
Apply = require('../models/Apply.model');

exports.createApply = function (req, res) {
    let id = req.body.id;
    console.log(req.body)
    User.findById(id, async (err, user) => {
        const company = await Company.findById(req.body.companyId).populate('recruiter');
        const apply = new Apply({
            message: req.body.message,
            job: req.body.jobId,
            candidate: id,
            companyName: company.name,
        });

        emailjs.init(config.get('emailjs'));
        emailjs.send('service_u9jzqef', 'template_63rp2ai', {  
            from_name: "JobBoard - Vous avez un nouveau candidat",
            to_name: company.recruiter.firstName + " " + company.recruiter.lastName,
            message: req.body.message,
            reply_to: company.recruiter.email,
            emailTo: company.recruiter.email,
        }).then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            console.log('FAILED...', error);
        });
        apply.save();
        return res.status(200).json({ apply, createdApply: true });
    })
};

exports.getApplies = function (req, res) {
    console.log(req.body)
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        var populateQuery = [{ path:'candidate', select:' _id firstName lastname ' }];
        const applies = await Apply.find()
        .populate('candidate')
        .populate('job');
        return res.status(200).json({ applies, createdApply: true });
    })
};

exports.getAppliesByCompany = function (req, res) {
    console.log(req.body)
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        const applies = await Apply.find({company: req.body.companyId}).populate('company');
        return res.status(200).json({ applies, createdApply: true });
    })
};

exports.getAppliesByUser = function (req, res) {
    console.log(req.body)
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        const applies = await Apply.find({user: req.body.userId}).populate('company');
        return res.status(200).json({ applies, createdApply: true });
    })
};

exports.deleteApply = function (req, res) {
    console.log(req.body)
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        const apply = await Apply.findByIdAndDelete(req.body.applyId);
        return res.status(200).json({ apply, createdApply: true });
    })
};

exports.updateApply = function (req, res) {
    console.log(req.body)
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        const apply = await Apply.findByIdAndUpdate(req.body.applyId, req.body);
        return res.status(200).json({ apply, createdApply: true });
    })
};