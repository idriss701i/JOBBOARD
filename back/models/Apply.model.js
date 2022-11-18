const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplySchema = new Schema({
    message: {
        type: String,
        require: true,
        trim: true,
    },
    job: {
        type: Schema.Types.ObjectId, 
        ref: 'Job'
    }, 
    candidate: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },  
    companyName: {
        type: String,
        require: true,
        trim: true,
    },
});

const Applies = mongoose.model('Applies', ApplySchema);

module.exports = Applies;