import express from 'express';
import homeRouter from './routes/home.router.js';
import studentRouter from './routes/student.router.js';
import userRouter from './routes/user.router.js';
import profileRouter from './routes/profile.router.js';


import logger from './middleware/logger.middleware.js';

import { connectMongoDB, connectMongoAtlasDB } from './config/db/connect.config.js';

import session from 'express-session';
import MongoStore from 'connect-mongo';


const app = express();
const PORT = 8000;
const ATLAS = false;
const MONGO_URL = "mongodb://127.0.0.1:27017/backend77080";

app.use(express.json());
app.use(logger);

// Generamos la Cookie
app.use(
    session({
        secret: 'clave_secreta',
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
