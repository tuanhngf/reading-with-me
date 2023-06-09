const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const tokenService = require('./token.service');
const { createTokenPair, verifyToken } = require('../auth/authUtils');
const { getInfo, mergeObjects, findByUsername } = require('../utils');
const { BadRequest, AuthFailure, NotFound } = require('../core/error.response');
const { HEADERS, TOKEN_EXP } = require('../configs');
const JWT = require('jsonwebtoken');

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

    logout = async (keyStore) => await tokenService.removeTokenById(keyStore._id);

    auth = async (req) => {
        const userId = req[HEADERS.CLIENT_ID];
        if (!userId) throw new AuthFailure('Invalid Request');

        const keyStore = await tokenService.findUserById(userId);
        if (!keyStore) throw new NotFound('Token Not Found');

        const accessToken = req[HEADERS.AUTHORIZATION];
        if (!accessToken) throw new AuthFailure('Invalid Request');

        const { publicKey, privateKey, refreshToken } = keyStore;

        const { isTokenExpired: isAccessTokenExpired } = await verifyToken(accessToken, publicKey, userId);

        const { isTokenExpired: isRefreshTokenExpired, username } = await verifyToken(refreshToken, privateKey, userId);
        if (isRefreshTokenExpired) throw new AuthFailure('Token Expired');

        const foundUser = await findByUsername({ username });
        const user = getInfo({ fields: ['_id', 'username', 'name', 'email', 'mobile'], object: foundUser });

        if (isAccessTokenExpired) {
            const newAccessToken = await JWT.sign({ userId, username }, publicKey, {
                expiresIn: TOKEN_EXP.AT,
            });

            return {
                user: mergeObjects(user, { accessToken: newAccessToken }),
            };
        }

        return {
            user: mergeObjects(user, { accessToken }),
        };
    };
}

module.exports = new UserService();
