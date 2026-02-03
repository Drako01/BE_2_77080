import CustomRouter from './custom/CustomRouter.js';
import { requireJwtCookie } from '../middleware/auth.middleware.js';
import { polices } from '../middleware/polices.middleware.js';
import { Student } from '../config/models/student.model.js';


const router = new CustomRouter({ mergeParams: true });

// Params loader (carga previa de :id)
router.params('id', async (req, res, next, id) => {
    try {
        const s = await Student.findById(id).lean();
        req.studentLoader = s || null;
    } catch (_) {
        req.studentLoader = null;
    }
    next();
})

// Ruta con middleware en cadena (orden claro): auth -> prolitica de roles -> handler
router.get('/students/:id', requireJwtCookie, polices('admin', 'user'), (req, res) => {
    if (!req.studentLoader) return res.status(404).json({ error: "Student Not found.! (pre-cargado)" });
    res.status(200).json({loadedByParams: true, student: req.studentLoader});
})


// Enrutador Ping
router.group('/v1', (v1) => {
    v1.get('/ping', (req, res) => res.json({ok: true, version: 'v1'}))
});

// Subrouter anidadno con MergeParams: /students/:id/courses/*
router.group('/students/:id', (sub) => {
    sub.get('/courses', requireJwtCookie, (req, res) => {
        res.json({
            studentId: req.params.id,
            student: req.studentLoader,
            note: "Ejemplo para Subrouter con MergeParams",
            courses: ['JS Avanzado', 'Backend', 'SQL Avanzado', 'MongoDB']
        })
    })
})

// Router async con error capturado automaticamente por customrouter
router.get('/boom', async (req, res) => {
    throw new Error("Explosion controlada para demo de manejo de errores async");
})


export default router.router;