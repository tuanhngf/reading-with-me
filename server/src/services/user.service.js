const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const tokenService = require('./token.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfo, mergeObjects } = require('../utils');
const { BadRequest } = require('../core/error.response');

class UserService {
    signUp = async ({ username, name, email, mobile, password }) => {
        const handleUser = await userModel.findOne({ username }).lean();

        if (handleUser) {
            throw new BadRequest('Username already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newShop = await userModel.create({ username, name, email, mobile, password: passwordHash });

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        await tokenService.createToken({
            userId: newShop._id,
            publicKey,
            privateKey,
        });

        const tokens = await createTokenPair({ userId: newShop._id, username }, publicKey, privateKey);

        const user = getInfo({ fields: ['_id', 'username', 'name', 'email', 'mobile'], object: newShop });
        const accessToken = getInfo({ fields: ['accessToken'], object: tokens });

        return {
            code: 201,
            message: 'Register Success',
            user: mergeObjects(user, accessToken),
        };
    };
}

module.exports = new UserService();
