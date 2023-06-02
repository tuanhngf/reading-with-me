const userService = require('../services/user.service');

class UserController {
    signUp = async (req, res, next) => {
        try {
            return res.status(201).json(await userService.signUp(req.body));
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new UserController();
