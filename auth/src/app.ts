import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import https from 'https';
import fs from 'fs';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

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

exp.use(currentUserRouter);
exp.use(signinRouter);
exp.use(signoutRouter);
exp.use(signupRouter);

exp.all('*', async (req, res) => {
    throw new NotFoundError();
})

exp.use(errorHandler);

const httpsServer = https.createServer(credentials, exp);

export { httpsServer as app };