const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const tokenService = require('./token.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfo, mergeObjects, findByUsername } = require('../utils');
const { BadRequest, AuthFailure } = require('../core/error.response');

class UserService {
    signUp = async ({ username, name, email, mobile, password }) => {
        const handleUser = await userModel.findOne({ username }).lean();

        if (handleUser) {
            throw new BadRequest('Username already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({ username, name, email, mobile, password: passwordHash });

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair({ userId: newUser._id, username }, publicKey, privateKey);

        await tokenService.createToken({
            userId: newUser._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        const user = getInfo({ fields: ['_id', 'username', 'name', 'email', 'mobile'], object: newUser });
        const accessToken = getInfo({ fields: ['accessToken'], object: tokens });

        return {
            user: mergeObjects(user, accessToken),
        };
    };

    login = async ({ username, password }) => {
        const foundUser = await findByUsername({ username });
        if (!foundUser) throw new AuthFailure('User not registered');

        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) throw new AuthFailure('Wrong Password');

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        const { _id: userId } = foundUser;

        const tokens = await createTokenPair({ userId, username }, publicKey, privateKey);

        await tokenService.createToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        const user = getInfo({ fields: ['_id', 'username', 'name', 'email', 'mobile'], object: foundUser });
        const accessToken = getInfo({ fields: ['accessToken'], object: tokens });

        return {
            user: mergeObjects(user, accessToken),
        };
    };
}

module.exports = new UserService();
