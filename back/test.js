const nodemailer = require('nodemailer');


 async function send (){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'projectjobboard@gmail.com',
          pass: 'Swaggy123-'
        }, 
    });
    
    const mailOptions = {
        from: "projectjobboard@gmail.com",
        to: "ropojoru.ujilune@jollyfree.com",
        subject: "Test",
        text: "Ok"
    }

    await transporter.sendMail(mailOptions, function(err) {
        if (err) {
            console.log(err);
        }

        else console.log('Bien joué !')
    })
}

send();