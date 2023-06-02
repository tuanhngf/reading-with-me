const { CreatedResponse } = require('../core/success.response');
const userService = require('../services/user.service');

class UserController {
    signUp = async (req, res, next) => {
        new CreatedResponse({
            message: 'Register Success.',
            data: await userService.signUp(req.body),
        }).send(res)
    };
}

module.exports = new UserController();
