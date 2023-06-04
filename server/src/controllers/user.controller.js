const { CreatedResponse, SuccessResponse } = require('../core/success.response');
const userService = require('../services/user.service');

class UserController {
    signUp = async (req, res, next) => {
        new CreatedResponse({
            message: 'Register Success.',
            data: await userService.signUp(req.body),
        }).send(res)
    };

    login = async (req, res, next) => {
        new SuccessResponse({
            data: await userService.login(req.body),
        }).send(res)
    };
}

module.exports = new UserController();
