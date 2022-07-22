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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
it('fails when a email that does not exist is supplied', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signin')
        .send({
        email: "kriviemail@test.com",
        password: "password"
    })
        .expect(400);
}));
it('fails when an incorrect password is supplied', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: "kriviemail@test.com",
        password: "password"
    })
        .expect(201);
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signin')
        .send({
        email: "kriviemail@test.com",
        password: "passw"
    })
        .expect(400);
}));
it('responds with a cookie when given a valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: "kriviemail@test.com",
        password: "password"
    })
        .expect(201);
    const response = yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signin')
        .send({
        email: "kriviemail@test.com",
        password: "password"
    })
        .expect(200);
    expect(response.get("Set-Cookie")).toBeDefined();
}));
