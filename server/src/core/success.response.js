const reasonPhrases = require('../configs/reasonPhrases');
const statusCodes = require('../configs/statusCodes');

class SuccessResponse {
    constructor({ message, status = statusCodes.OK, reasonStatusCode = reasonPhrases.OK, data = {} }) {
        this.message = message ? message : reasonStatusCode;
        this.status = status;
        this.data = data;
    }

    send(res, header = {}) {
        return res.status(this.status).json(this);
    }
}

class OKResponse extends SuccessResponse {
    constructor({ message, data }) {
        super({ message, data });
    }
}

class CreatedResponse extends SuccessResponse {
    constructor({ message, status = statusCodes.CREATED, reasonStatusCode = reasonPhrases.CREATED, data }) {
        super({ message, status, reasonStatusCode, data });
    }
}

module.exports = { OKResponse, CreatedResponse };
