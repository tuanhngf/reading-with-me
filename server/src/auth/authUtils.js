const JWT = require('jsonwebtoken');
const { asyncHandle } = require('../utils');
const { AuthFailure, NotFound } = require('../core/error.response');
const { findUserById } = require('../services/token.service');
const { HEADERS, TOKEN_EXP } = require('../configs');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: TOKEN_EXP.AT,
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: TOKEN_EXP.RT,
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {}
};

const authentication = asyncHandle(async (req, res, next) => {
    const userId = req.headers[HEADERS.CLIENT_ID];
    if (!userId) throw new AuthFailure('Invalid Request');

    const keyStore = await findUserById(userId);
    if (!keyStore) throw new NotFound('Token Not Found');

    const accessToken = req.headers[HEADERS.AUTHORIZATION];
    if (!accessToken) throw new AuthFailure('Invalid Request');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailure('Invalid Request');
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw new AuthFailure('Invalid Request');
    }
});

const verifyToken = async (token, key, userId) => {
    try {
        const { userId: decodedUserId, username } = await JWT.verify(token, key);
        if (userId !== decodedUserId) throw new AuthFailure('Invalid Request');
        return { username, isTokenExpired: false };
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new AuthFailure('Invalid Token');
        }
        return { userName: null, isTokenExpired: true };
    }
};

module.exports = { createTokenPair, authentication, verifyToken };
