const JWT = require('jsonwebtoken');
const { asyncHandle } = require('../utils');
const { AuthFailure, NotFound } = require('../core/error.response');
const { findUserById } = require('../services/token.service');

const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('Error Verify: ', err);
                return;
            }

            console.log('Decode verify: ', decode);
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {}
};

const authentication = asyncHandle(async (req, res, next) => {
    /* Check userId missing
     get accessToken
     verifyToken
     check userId in db
     check keyStore with userId
     if OK => next()
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailure('Invalid Request');

    const keyStore = await findUserById(userId);
    if (!keyStore) throw new NotFound();

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailure('Invalid Request');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailure('Invalid Request');
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
});

module.exports = { createTokenPair, authentication };
