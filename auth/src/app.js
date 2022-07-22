"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
const cookie_session_1 = __importDefault(require("cookie-session"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const current_user_1 = require("./routes/current-user");
const signin_1 = require("./routes/signin");
const signout_1 = require("./routes/signout");
const signup_1 = require("./routes/signup");
const error_handler_1 = require("./middlewares/error-handler");
const not_found_error_1 = require("./errors/not-found-error");
const privateKey = fs_1.default.readFileSync("/run/hackerchat-cert/tls.key");
const certificate = fs_1.default.readFileSync("/run/hackerchat-cert/tls.crt");
const credentials = { key: privateKey, cert: certificate };
const exp = (0, express_1.default)();
exp.set('trust proxy', true);
exp.use((0, body_parser_1.json)());
exp.use((0, cookie_session_1.default)({
    signed: false,
    secure: true,
    httpOnly: false
}));
exp.use(current_user_1.currentUserRouter);
exp.use(signin_1.signinRouter);
exp.use(signout_1.signoutRouter);
exp.use(signup_1.signupRouter);
exp.all('*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    throw new not_found_error_1.NotFoundError();
}));
exp.use(error_handler_1.errorHandler);
const httpsServer = https_1.default.createServer(credentials, exp);
exports.app = httpsServer;
