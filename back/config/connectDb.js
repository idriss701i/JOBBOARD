var mongoose = require('mongoose');
const config = require('config');

async function connect()
{
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((ans) => {
            console.log("Connected Successful");
        })
        .catch((err) => {
            console.log("Error in the Connection");
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = connect;