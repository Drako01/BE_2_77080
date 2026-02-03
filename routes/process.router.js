import { Router } from "express";
import { getPublicEnv } from "../config/env.config.js";

const router = Router();

router.get('/info', (req, res) => {
    res.status(200).json({
        pid: process.pid,
        node: process.version,
        platform: process.platform,
        cwd: process.cwd(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        argv: process.argv,
        public_envs: getPublicEnv() 
    })
})

router.get('/', (req, res) => {
    res.status(200).json({environments: getPublicEnv()})
})

export default router;