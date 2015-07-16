var transporter = require('./transporter');
var activator = require('activator');
var userModel = {
    find: function(login, cb) {
        console.log('find',arguments);
    },
    save: function(id,model,cb){
        console.log('save',arguments);
    }
};
var template = __dirname + '/public/activator';

activator.init({
    user: userModel,
    transport: transporter,
    templates: template
});

module.exports = activator;
