import homeRouter from './routes/home.router.js';
import studentRouter from './routes/student.router.js';
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';
import authJwtRouter from './routes/jwt.router.js';
import profileRouter from './routes/profile.router.js';
import apiV1Router from './routes/api.v1.router.js';
import advancedRouter from './routes/advanced.router.js';
import processRouter from './routes/process.router.js';
import newStudentRouter from './routes/new.student.router.js';
import orderRouter from './routes/order.router.js';
import messagesRouter from './routes/messaging.router.js';
import emailRouter from './routes/mailer.router.js';


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

    // Enrutador avanzado con Controlador
    app.use('/new-student', newStudentRouter);

    // Enrutador de Ordenes
    app.use('/', orderRouter);

    // Enrutador de Mensajes
    app.use('/', messagesRouter);
    
    // Enrutador de Emails
    app.use('/', emailRouter);

    // Enrutador para manejar error 404.
    app.use((req, res) => {
        res.status(404).json({ error: "Page not found.!" })
    })
}