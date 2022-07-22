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
exports.signupRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_1 = require("../models/user");
const bad_request_error_1 = require("../errors/bad-request-error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validate_request_1 = require("../middlewares/validate-request");
const router = express_1.default.Router();
exports.signupRouter = router;
router.post('/api/users/signup', [
    (0, express_validator_1.body)('email')
        .trim()
        .isLength({ min: 4, max: 25 })
        .withMessage('Email must be valid'),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
], validate_request_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield user_1.User.findOne({ email });
    if (existingUser) {
        throw new bad_request_error_1.BadRequestError('Email already in use');
    }
    const user = user_1.User.build({ email, password });
    yield user.save();
    // Generate JWT
    const userJwt = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY);
    // Store it on session object
    req.session = {
        jwt: userJwt
    };
    res.status(201).send(user);
}));
