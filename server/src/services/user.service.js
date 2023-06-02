const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const tokenService = require('./token.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfo, mergeObjects } = require('../utils');

class UserService {
    signUp = async ({ username, name, email, mobile, password }) => {
        try {
            const handleUser = await userModel.findOne({ username }).lean();

            if (handleUser) {
                return {
                    code: 'xxx',
                    message: 'Username already registered',
                    username
                };
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
        } catch (error) {
            return {
                code: 'xxx',
                message: error,
                status: 'error',
            };
        }
    };
}

module.exports = new UserService();
