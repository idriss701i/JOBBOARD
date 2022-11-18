const express = require('express'), 
User = require('../models/User.model'),
config = require('config'),
jwt = require("jwt-simple"), 
bcrypt = require("bcrypt"),
emailjs = require('@emailjs/browser'), 
Job = require('../models/Job.model');

exports.createJob = function (req, res) {
    console.log(req.body)
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (!user.isRecruiter && !user.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        const job = new Job({
            name: req.body.title, 
            description: req.body.description,
            company: req.body.company,
            shortDescription: req.body.shortDescription,
            salary: req.body.salary,
            expiredDate: req.body.expiredDate,
        });
        job.save();
        return res.status(200).json({ job, createdJob: true });
    })
};

exports.createJob = function (req, res) {
    console.log(req.body)
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (!user.isRecruiter && !user.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        const job = new Job({
            name: req.body.title, 
            description: req.body.description,
            company: req.body.company,
            shortDescription: req.body.shortDescription,
            salary: req.body.salary,
            expiredDate: req.body.expiredDate,
        });
        job.save();
        return res.status(200).json({ job, createdJob: true });
    })
};

exports.getJobs = function (req, res) {
    console.log(req.body)
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if(!user.isRecruiter && !user.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        else if(user.isRecruiter) {
            const jobs = await Job.find({recruiter: user._id}).populate('company');
            return res.status(200).json({ jobs, createdJob: true });
        }
        else if(user.isAdmin) {
            const jobs = await Job.find().populate('company');
            return res.status(200).json({ jobs, createdJob: true });
        }
    });
};

exports.getAllJobs = async function (req, res) {
    console.log(req.body)
    const jobs = await Job.find().populate('company');
    return res.status(200).json({ jobs, createdJob: true });
};

exports.getJob = function (req, res) {
    console.log(req.body)
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (!user.isRecruiter && !user.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        const job = await Job.findById(req.params.id).populate('company').populate('recruiter');
        return res.status(200).json({ job, createdJob: true });
    })
};

exports.deleteJob = function (req, res) {
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    console.log(decoded);
    User.findById(id, async (err, user) => {
        const job = await Job.findById(req.params.id).populate('company');
        console.log(job);
        if (!user.isRecruiter && !user.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        else if (job.company.recruiter == id) {
            console.log('delete');
            job.delete();
            return res.status(200).json({ deletedJob: true });
        }
        else if(user.isAdmin) {
            return res.status(200).json({ job, deletedJob: true });
        }
    })
}

exports.updateJob = function (req, res) {  
    console.log(req.body);  
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {    
        if (!user.isRecruiter && !user.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        
        const job = await Job.findByIdAndUpdate(req.body.jobInModal._id, {
            name: req.body.jobInModal.name, 
            description: req.body.jobInModal.description,
            company: req.body.company,
            shortDescription: req.body.jobInModal.shortDescription,
            salary: req.body.jobInModal.salary,
            // expiredDate: req.body.expiredDate,
        });
        return res.status(200).json({ job, createdJob: true });
    });
}