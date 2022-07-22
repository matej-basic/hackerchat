import mongoose from "mongoose";
import { app } from './app';

const servicePort = 3000;

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-cip:27017/auth');
        console.log('Connected to mongoDB');
    }catch (err) {
        console.log(err);
    }

    //app.listen(servicePort, () => {
    //    console.log("Listening on port: " + servicePort);
    //});
    app.listen(servicePort);
}

start();