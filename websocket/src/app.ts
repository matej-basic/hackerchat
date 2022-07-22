import express from 'express'
import 'express-async-errors';
import { json } from 'body-parser';
import https from 'https';
import fs from 'fs';
import cookieSession from 'cookie-session';
import WebSocket from 'ws';

const privateKey = fs.readFileSync("/run/hackerchat-cert/tls.key");
const certificate = fs.readFileSync("/run/hackerchat-cert/tls.crt");
const credentials = {key: privateKey, cert: certificate};

const exp = express();
exp.set('trust proxy', true);
exp.use(json());
exp.use(cookieSession({
    signed: false,
    secure: true,
    httpOnly: false
}));

const server = https.createServer(credentials, exp);

const wss = new WebSocket.Server({server:server});

server.listen(3000);

export { wss as app };