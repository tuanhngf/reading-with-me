const ReasonPhrases = require('../configs/reasonPhrases');
const StatusCodes = require('../configs/statusCodes');

const statusCodes = StatusCodes;
const messages = ReasonPhrases;

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequest extends ErrorResponse {
    constructor(message = messages.CONFLICT, status = statusCodes.CONFLICT) {
        super(message, status);
    }
}

class BadRequest extends ErrorResponse {
    constructor(message = messages.BAD_REQUEST, status = statusCodes.BAD_REQUEST) {
        super(message, status);
    }
}

class AuthFailure extends ErrorResponse {
    constructor(message = messages.UNAUTHORIZED, status = statusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}

class NotFound extends ErrorResponse {
    constructor(message = messages.NOT_FOUND, status = statusCodes.NOT_FOUND) {
        super(message, status);
    }
}

module.exports = { ConflictRequest, BadRequest, AuthFailure, NotFound };
