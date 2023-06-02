const tokenModel = require('../models/token.model');

class TokenService {
    createToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const tokens = await tokenModel.create({
                userId,
                publicKey,
                privateKey
            });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = new TokenService()