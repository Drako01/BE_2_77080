import homeRouter from './home.router.js';
import studentRouter from './student.router.js';
import userRouter from './user.router.js';
import authRouter from './auth.router.js';
import authJwtRouter from './jwt.router.js';
import profileRouter from './profile.router.js';

export function initRouters(app) {
    app.use('/', homeRouter);
    app.use('/student', studentRouter);
    app.use('/auth', userRouter);
    app.use('/auth/me', profileRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/auth-jwt', authJwtRouter);
}