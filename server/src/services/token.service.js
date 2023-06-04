const { default: mongoose } = require('mongoose');
const tokenModel = require('../models/token.model');

class TokenService {
    createToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { userId };
            const update = { publicKey, privateKey, refreshToken, refreshTokenUsed: [] };
            const options = { upsert: true, new: true };

            const tokens = await tokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    findUserById = async (userId) => await tokenModel.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean();

    removeTokenById = async (id) => await tokenModel.deleteOne((id = new mongoose.Types.ObjectId(id))).lean();
}

module.exports = new TokenService();
