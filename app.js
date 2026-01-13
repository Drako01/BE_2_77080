import express from 'express';
import homeRouter from './routes/home.router.js';
import studentRouter from './routes/student.router.js';
import userRouter from './routes/user.router.js';
import profileRouter from './routes/profile.router.js';
import dotenv from 'dotenv';


import logger from './middleware/logger.middleware.js';

import { connectMongoDB, connectMongoAtlasDB } from './config/db/connect.config.js';

import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const ATLAS = String(process.env.ATLAS).toLowerCase() === 'true';
const MONGO_URL = ATLAS ? process.env.MONGO_ATLAS_URL : process.env.MONGO_URL;
const SECRET_SESSION = process.env.SECRET_SESSION;

app.use(express.json());
app.use(logger);

// Generamos la Cookie
app.use(
    session({
        secret: SECRET_SESSION,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
            ttl: 60 * 60 // 1hr
        }),
        cookie: {
            maxAge: 1 * 60 * 60 * 1000, // 1hr
            httpOnly: true,
            signed: true
        }
    })
)


app.use('/', homeRouter);
app.use('/student', studentRouter);
app.use('/auth', userRouter);
app.use('/auth/me', profileRouter);


const startServer = async () => {
    ATLAS ? connectMongoAtlasDB() : connectMongoDB();
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
}

await startServer();
