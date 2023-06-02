const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('', (req, res, next) => {
    return res.status(200).json({
        message: 'welcome to Reading With Me - API - Users',
    });
});

router.post('/signup', userController.signUp);

module.exports = router;
