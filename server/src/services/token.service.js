const tokenModel = require('../models/token.model');

class TokenService {
    createToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { userId };
            const update = { publicKey, privateKey, refreshToken, refreshTokenUsed: [] };
            const options = { upsert: true, new: true };

            const tokens = await tokenModel.findByIdAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = new TokenService();
