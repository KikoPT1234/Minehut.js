"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = "Minehut API Error";
        Error.captureStackTrace(this, APIError);
    }
}
exports.APIError = APIError;
//# sourceMappingURL=APIError.js.map