const express = require('express');
const userController = require('../controllers/user.controller');
const { asyncHandle } = require('../utils');
const { authentication } = require('../auth/authUtils');

const router = express.Router();

router.get('', (req, res, next) => {
    return res.status(200).json({
        message: 'welcome to Reading With Me - API - Users',
    });
});

router.post('/signup', asyncHandle(userController.signUp));
router.post('/login', asyncHandle(userController.login));
router.post('/auth', asyncHandle(userController.auth));

router.use(authentication);

router.post('/logout', asyncHandle(userController.logout));

module.exports = router;
