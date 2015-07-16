var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ercsbcdss@gmail.com',
        pass: 'whdgkqrhks101'
    }
});

module.exports = transporter;
