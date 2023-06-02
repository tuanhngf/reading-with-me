const express = require('express');

const router = express.Router();
const user = require('./user.route');

router.use('', user);

router.get('', (req, res, next) => {
    return res.status(200).json({
        message: 'welcome to Reading With Me - API',
    });
});

module.exports = router;
