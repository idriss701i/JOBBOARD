const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompaniesSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    recruiter: { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }
});

const Company = mongoose.model('Companies', CompaniesSchema);

module.exports = Company;