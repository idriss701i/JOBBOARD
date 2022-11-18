const User = require('../models/User.model'),
config = require('config'),
jwt = require("jwt-simple"), 
Company = require('../models/Companies.model');

exports.createCompany = function (req, res) {
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (!user.isRecruiter && !user.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        const company = new Company({
            name: req.body.name,
            recruiter: req.body.recruiter,
        });
        User.findById(req.body.recruiter, async (err, recruiter) => {
            recruiter.isRecruiter = true;
            await recruiter.save();
        });
        company.save()
        return res.status(200).json({ company, createdCompany: true });
    })
};

exports.getOneCompany = function (req, res) {
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (!user.isRecruiter && !user.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        let company = await Company.findById(req.params.id).populate('recruiter');
        return res.status(200).json({ company, updatedCompany: true });
    })
};

exports.getCompanies = function (req, res) {
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (!user.isAdmin && !user.isRecruiter) {
            return res.status(401).send('Unauthorized');
        }
        else if (user.isRecruiter) {
            let companies = await Company.find({recruiter: user._id}).populate('recruiter');
            return res.status(200).json({ companies });
        }
        let companies = await Company.find().populate('recruiter');
        return res.json(companies);
    })
};

exports.deleteCompany = function (req, res) {
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (!user.isAdmin) {
            res.status(401).send('Unauthorized');
        }
        Company.findByIdAndDelete(req.params.id, async (err, company) => {
            if (err) {
                return res.status(500).send({error: "Problem with this company !"})
            };
            return res.send({ success: "Delete sucessfull" });
        })
    })
};


exports.updateCompany = function (req, res) {
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (!user.isAdmin && !user.isRecruiter) {
            res.status(401).send('Unauthorized');
        }
        console.log(req.body);
        Company.findByIdAndUpdate(req.params.id, req.body, async (err, company) => {
            if (err) {
                return res.status(500).send({error: "Problem with this company !"})
            };
            return res.send({ success: "Update sucessfull" });
        })
    })
};

