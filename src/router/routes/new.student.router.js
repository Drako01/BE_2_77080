import { Router } from "express";
import { requireJwtCookie } from "../../middleware/auth.middleware.js";
import { polices } from '../../middleware/polices.middleware.js';
import { studentController as ctrl} from '../../controllers/student.controller.js';


const router = Router();
router.use(requireJwtCookie);

router.get('/', ctrl.list);
router.get('/:id', polices('admin', 'user'), ctrl.get);
router.post('/', polices('admin'), ctrl.create);
router.put('/:id', polices('admin'), ctrl.update);
router.delete('/:id', polices('admin'), ctrl.remove);


export default router;