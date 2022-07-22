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
exports.signinRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bad_request_error_1 = require("../errors/bad-request-error");
const validate_request_1 = require("../middlewares/validate-request");
const user_1 = require("../models/user");
const password_1 = require("../services/password");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
exports.signinRouter = router;
router.post('/api/users/signin', [
    (0, express_validator_1.body)('email')
        .trim()
        .isLength({ min: 4, max: 25 })
        .withMessage('Email must be valid'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
], validate_request_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield user_1.User.findOne({ email });
    if (!existingUser) {
        throw new bad_request_error_1.BadRequestError('Invalid credentials');
    }
    const passwordsMatch = yield password_1.Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
        throw new bad_request_error_1.BadRequestError('Invalid credentials');
    }
    // Generate JWT
    const userJwt = jsonwebtoken_1.default.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY);
    // Store it on session object
    req.session = {
        jwt: userJwt
    };
    res.status(200).send(existingUser);
}));
