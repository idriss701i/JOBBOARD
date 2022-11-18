const express = require('express'), 
User = require('../models/User.model'),
config = require('config'),
jwt = require("jwt-simple"), 
bcrypt = require("bcrypt"),
emailjs = require('@emailjs/browser');
const Company = require('../models/Companies.model');


exports.login = async function (req, res) {
    let user = await User.findOne({ username: req.body.username })

    if(!user) {
        return res.json({ msg: 'Utilisateur non existant', login: false  }).status(400)
    }

    else if(!bcrypt.compareSync(req.body.password, user.password)){
        return res.json({ msg: 'Mot de passe incorrect', login: false }).status(400)
    }
    else {
        let company;
        if(user.isRecruiter === true) {
            company = Company.findOne({ recruiter: user._id }, (err, company) => {})
        }
        var payload = {
                id: user.id,
                expire: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
                isAdmin: user.isAdmin,
                isRecruiter: user.isRecruiter, 
                companyId: company ? company._id : null
        };
        var token = jwt.encode(payload, config.get('jwtToken'));
        return res.json({
            token, 
            msg: 'Connexion réussie avec succès, vous allez être redirigé !',
            login: true
        }); 
    } 
}



exports.register = async function  (req, res) {
    const salt = await bcrypt.genSalt(10);
    const rand = Math.random().toString(16).substr(2, 8);
    if (req.body.nonAccount ===  null) {
        req.body.password = await bcrypt.hash(rand, salt);
    }
    else req.body.password = await bcrypt.hash(req.body.password, salt);
    User.register(
        new User({ 
            firstName: req.body.firstName, 
            username: req.body.email,
            lastname: req.body.lastName, 
            gender: req.body.gender,
            email: req.body.email,
            dob: new Date(req.body.dob),
            address: req.body.address,
            city: req.body.city,
            postal: req.body.postal,
            country: req.body.country,
            password: req.body.password,
            isRecruiter: req.body.isRecruiter
        }),
        req.body.password, 
        function (err, user){
            if (err) {
                console.log(err);
                if(err.name === 'UserExistsError') res.send({msg: 'Utilisateur déjà existant, veuillez utiliser une autre adresse électronique', register: false });
                
            } else {
                if(req.body.isRecruiter === true) {
                    Company.create({ name: req.body.company, recruiter: user._id }, (err, company) => {
                        if(err) console.log(err);
                        else { 
                            console.log("Entreprise créee avec succès");
                        }
                    });
                }
                if(req.body.nonAccount === true) {
                    try {
                        emailjs.init(config.get('emailjs'));
                        emailjs.send("service_u9jzqef","template_63rp2ai",{
                            from_name: "JobBoard",
                            to_name: req.body.firstName,
                            message: `Afin de suivre votre candidature, veuillez vous connecter sur votre compte. Identifiant: ${req.body.email}\nMot de passe: ${rand}`,
                            emailTo: req.body.email,
                        }).then(function(response) {
                            console.log('SUCCESS!', response.status, response.text);
                        }, function(error) {
                            console.log('FAILED...', error);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
                res.send({ msg: "Successful", register: true, user });
            }
        }
    )
}

exports.updateUser = async function (req, res, next) {  
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    const salt = await bcrypt.genSalt(10);
    User.findByIdAndUpdate(id, req.body, async (err,user) => {
        if (err) {
          return res.status(500).send({msg: "Problem with the user !", edit: true})
        };
        if (req.body.password ===  null && req.body.password.length > 0) {
            req.body.password = await bcrypt.hash(req.body.password, salt);
            user.password = req.body.password;
            user.save();
        }
        if(user.isRecruiter === true && req.body.companyName !== null) {
            let company = await Company.findByIdAndUpdate(req.body.companyID, {
                name: req.body.companyName
            })
            company.save();
        }
        res.send({ msg: "Updation successfull", edit: true });
    })
}

exports.deleteUser = async function (req, res, next) {  
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    if (req.user.isAdmin === false) {
        res.status(401).send('Unauthorized');
    }
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) {
            return res.status(500).send({error: "Problem with this user !"})
        };
        if (user.isRecruiter === true) {
            Company.findOneAndDelete({ recruiter: user._id }, (err, company) => {
                if (err) {
                    return res.status(500).send({error: "Problem with this company !"})
                };
                Job.find({ company: company._id }, (err, jobs) => {
                    if (err) {
                        return res.status(500).send({error: "Problem with this company !"})
                    };
                    jobs.map(job => {
                        job.delete();
                    })
                })            })
        }
        res.send({ success: "Delete sucessfull" });
    })
}

exports.getUsers = async function (req, res, next) {  
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (user.isAdmin === false) {
            
            res.status(401).send('Unauthorized');
        }
        let users = await User.find({ "_id": { $ne: id } });
        res.status(200).json({ users })
    })
}

exports.getUser = async function (req, res, next) {  
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    let id = decoded.id;
    User.findById(id, async (err, user) => {
        if (!user) {
            res.status(401).send('Unauthorized');
        }
        if(user.isRecruiter === true) {
            const company = await Company.findOne({ recruiter: user._id });
            return res.status(200).json({ user, company });
        }
        return res.status(200).json({ user });
    })
}

exports.updateOneUser = async function (req, res, next) {  
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    if(req.user.isAdmin === false) return res.status(401).send('Unauthorized');
    const salt = await bcrypt.genSalt(10);
    User.findByIdAndUpdate(req.body.id, req.body, async (err, user) => {
        if (!user) {
            res.status(401).send('Unauthorized');
        }
        if (req.body.password ===  null && req.body.password.length > 0) {
            req.body.password = await bcrypt.hash(req.body.password, salt);
            user.password = req.body.password;
            user.save();
        }
        res.status(200).send({ msg: "Updation successfull", edit: true });
    })
}

exports.getOneUser = async function (req, res, next) {  
    let token =  req.headers.authorization.split(" ")[1];
    let decoded  = jwt.decode(token, config.get('jwtToken'), true);
    if(req.user.isAdmin === false) return res.status(401).send('Unauthorized');
    User.findById(req.params.id, async (err, user) => {
        if (!user) {
            res.status(401).send('Unauthorized');
        }
        res.status(200).send({ msg: "Get successfull", user });
    })
}

exports.createUser = async function (req, res, next) {
    const salt = await bcrypt.genSalt(10);
    const rand = Math.random().toString(16).substr(2, 8);
    req.body.password = await bcrypt.hash(rand, salt);
    if(req.user.isAdmin === false) return res.status(401).send('Unauthorized');
    User.register(
        new User({ 
            firstName: req.body.firstName, 
            username: req.body.email,
            lastname: req.body.lastName, 
            gender: req.body.gender,
            email: req.body.email,
            dob: new Date(req.body.dob),
            address: req.body.address,
            city: req.body.city,
            postal: req.body.postal,
            country: req.body.country,
            password: req.body.password
        }),
        req.body.password, 
        function (err, msg){
            if (err) {
                if(err.name === 'UserExistsError') res.send({msg: 'Utilisateur déjà existant, veuillez utiliser une autre adresse électronique', register: false });
                
            } else {
                try {
                    emailjs.init(config.get('emailjs'));
                    emailjs.send("service_u9jzqef","template_63rp2ai",{
                        from_name: "JobBoard",
                        to_name: req.body.firstName,
                        message: `Identifiant: ${req.body.email}\nMot de passe: ${rand}`,
                        emailTo: req.body.email,
                    }).then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                    }, function(error) {
                        console.log('FAILED...', error);
                    });
                } catch (error) {
                    console.log(error);
                }
                res.send({ msg: "Successful", register: true });
            }
        }
    )
}