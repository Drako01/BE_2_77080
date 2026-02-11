import { Router } from "express";
import homeRouter from './home.router.js';
import studentRouter from './student.router.js';
import authRouter from './auth.router.js';

const router = Router({ mergeParams: true });

router.use('/', homeRouter);
router.use('/student', studentRouter);
router.use('/api/auth', authRouter);

export default router;