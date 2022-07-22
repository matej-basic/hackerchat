"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const custom_error_1 = require("./custom-error");
class DatabaseConnectionError extends custom_error_1.CustomError {
    constructor() {
        super('Error connecting to database');
        this.reason = 'Error connecting to database';
        this.statusCode = 500;
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return [
            { message: this.reason }
        ];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
