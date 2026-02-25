import { Router } from 'express';
import { requireJwtCookie } from "../../middleware/auth.middleware.js";
import { polices } from '../../middleware/polices.middleware.js';
import { orderController as ctrl } from '../../controllers/order.controller.js';


const router = Router();

// router.use(requireJwtCookie);

// Vistas
router.get('/orders', (req, res) => ctrl.listView(req, res));


// API REST
router.get('/api/orders', (req, res) => ctrl.listJSON(req, res));
router.get('/api/orders/:id', polices('admin', 'user'), (req, res) => ctrl.getById(req, res));
router.get('/api/orders/:code', polices('admin', 'user'), (req, res) => ctrl.getByCode(req, res));
router.post('/api/orders/', polices('admin'),(req, res) => ctrl.create(req, res));
router.put('/api/orders/:id', polices('admin'),(req, res) => ctrl.update(req, res));
router.delete('/api/orders/:id', polices('admin'),(req, res) => ctrl.remove(req, res));

// Semilla Base
router.post('/api/orders/seed', (req, res) => ctrl.seed(req, res));

export default router;