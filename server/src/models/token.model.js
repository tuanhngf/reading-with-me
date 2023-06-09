const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Token';
const COLLECTION_NAME = 'Tokens';

var tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        publicKey: {
            type: String,
            required: true,
        },
        privateKey: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, tokenSchema);
