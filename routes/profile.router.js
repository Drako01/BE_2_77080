import { Router } from "express";
import { requireLogin } from "../middleware/auth.middleware.js";

const router = Router();

router.get('/', requireLogin, (req, res) => {
    try {
        const { first_name, last_name, email, age } = req.session.user;
        const full_name = first_name + ' ' + last_name;
        const welcome = `Bienvenido ${full_name}`;
        res.status(200).json({ message: welcome, user: { first_name, last_name, email, age } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router;