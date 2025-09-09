"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = void 0;
const sendErrorResponse = (error, res) => {
    const statusCode = error.statusCode || 400;
    res
        .status(statusCode)
        .json({ success: false, message: error.message || "Something went wrong" });
};
exports.sendErrorResponse = sendErrorResponse;
