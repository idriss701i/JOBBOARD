const mongoose = require('mongoose'), passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new Schema({
    firstName: {
        type: String,
        require: true,
        trim: true,
    },
    lastname: {
        type: String,
        require: true,
        trim: true,
    },
    email:   { 
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Adresse E-mail requise',
        validate: [validateEmail, 'Veuillez entrer une adresse e-mail valide.'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer une adresse e-mail valide.']
    },
    password: {
        type: String,
        require: true,
        trim: true,
    },
    username:   { 
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Adresse E-mail requise',
        validate: [validateEmail, 'Veuillez entrer une adresse e-mail valide.'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer une adresse e-mail valide.']
    },

    gender: {
        type: String, 
        enum: ["Male", "Female", "Other"],
        require: true,
    },
    dob: {
        type: Date,
        require: true, 
    }, 
    address: {
        type: String,
        require: true,
        trim: true,
    },
    city: {
        type: String,
        require: true,
        trim: true
    },
    postal: {
        type: String, 
        require: true, 
        trim: true,
    },
    country: {
        type: String, 
        require: true, 
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isRecruiter: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    disabled: {
        type: Boolean,
        default: false
    },
}
);


UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);

module.exports = User;