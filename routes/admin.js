var express = require('express');
var router = express.Router();

router.get('/',
    function(req, res) {
        res.render('system/admin', {
            user: req.user,
            session: req.session
        });
    }
);

module.exports = router;
