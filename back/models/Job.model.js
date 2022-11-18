const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    description: {
        type: String,
        require: true,
        trim: true,
    },
    shortDescription: {
        type: String,
        require: true,
        trim: true,
    },
    company: { 
        type: Schema.Types.ObjectId, 
        ref: 'Companies' 
    },
    salary: {
        type: Number,
        require: true,
    },
    expiredDate: {
        type: Date, 
        require: true
    },
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;