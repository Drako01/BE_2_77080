import express from 'express';
import homeRouter from './routes/home.router.js';
import studentRouter from './routes/student.router.js';
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';

import profileRouter from './routes/profile.router.js';
import dotenv from 'dotenv';
import passport from 'passport';

import logger from './middleware/logger.middleware.js';

import { connectAuto } from './config/db/connect.config.js';
import { initPassport } from './config/auth/passport.config.js';


import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const SECRET_SESSION = process.env.SECRET_SESSION || "clave_secreta";

app.use(express.json());
app.use(logger);
app.use(cookieParser(SECRET_SESSION))

const startServer = async () => {

    await connectAuto();

    const store = MongoStore.create({
        client: ((await import("mongoose")).default.connection.getClient()),
        ttl: 60 * 60
    })

    // Generamos la Cookie
    app.use(
        session({
            secret: SECRET_SESSION ,
            resave: false,
            saveUninitialized: false,
            store,
            cookie: {
                maxAge: 1 * 60 * 60 * 1000, // 1hr
                httpOnly: true,
                signed: true
            }
        })
    )

    initPassport();
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/', homeRouter);
    app.use('/student', studentRouter);
    app.use('/auth', userRouter);
    app.use('/auth/me', profileRouter);
    app.use('/api/auth', authRouter);



    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
}

await startServer();
