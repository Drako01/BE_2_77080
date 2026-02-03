import homeRouter from './home.router.js';
import studentRouter from './student.router.js';
import userRouter from './user.router.js';
import authRouter from './auth.router.js';
import authJwtRouter from './jwt.router.js';
import profileRouter from './profile.router.js';
import apiV1Router from './api.v1.router.js';
import advancedRouter from './advanced.router.js';
import processRouter from './process.router.js';



export function initRouters(app) {
    app.use('/', homeRouter);
    app.use('/student', studentRouter);
    app.use('/auth', userRouter);
    app.use('/auth/me', profileRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/auth-jwt', authJwtRouter);

    // Enrutadores Avanzados y Subenrutadores
    app.use('/api/v1', apiV1Router);
    app.use('/advanced', advancedRouter);
    app.use('/process', processRouter);


    // Enrutador para manejar error 404.
    app.use((req, res) => {
        res.status(404).json({ error: "Page not found.!" })
    })
}