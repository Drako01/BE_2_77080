import express from 'express';
import passport from 'passport';

import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

import environment, { validateEnv } from '../config/env.config.js';

import { initRouters } from './../routes/router.js';
import logger from './../middleware/logger.middleware.js';

import { connectAuto } from './../config/db/connect.config.js';
import { initPassport } from './../config/auth/passport.config.js';


const app = express();
const PORT = environment.PORT;
const SECRET_SESSION = environment.SECRET_SESSION;

app.use(express.json());
app.use(logger);
app.use(cookieParser(SECRET_SESSION))

export const startServer = async () => {

    // Validar la existencia de las variables de entorno
    validateEnv();

    // Conectamos a la BD
    await connectAuto();

    const store = MongoStore.create({
        client: ((await import("mongoose")).default.connection.getClient()),
        ttl: 60 * 60
    })

    // Generamos la Cookie
    app.use(
        session({
            secret: SECRET_SESSION,
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

    // Inicializar todos los enrutadores
    initRouters(app);

    // Incializacion de el servidor (listen)
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
}