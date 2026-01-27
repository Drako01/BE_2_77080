import { Router } from "express";
import { User } from "../config/models/user.model.js";
import bcrypt from 'bcrypt';
import { requireJwtCookie, requireManyRoles } from "../middleware/auth.middleware.js";
import jwt from 'jsonwebtoken';


const router = new Router();

/** JWT */
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ error: "Bad Request.!", message: "All fields are required.!" });
        }
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: "This mail already registered.!" });
        const hash = await bcrypt.hash(password, 10);
        await User.create({ first_name, last_name, email, age, password: hash });

        res.status(201).json({ message: "User created successfully", user: { first_name, last_name, email, age, password } })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Invalid Credentials - email doesn´t exists" })
        }
        const u = await User.findOne({ email });
        if (!u || !u.password) {
            return res.status(400).json({ error: "Invalid Credentials" })
        }
        const ok = await bcrypt.compare(password, u.password);
        if (!ok) return res.status(400).json({ error: "Invalid Credentials" })

        const payload = { sub: String(u._id), email: u.email, role: u.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Cookie HttpOnly
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 60 * 60 * 1000,
            path: '/'
        })

        res.status(200).json({ message: "Login OK (JWT en Cookie)", user: u, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/me', requireJwtCookie, requireManyRoles("user", "admin"), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found.!" });
        const { first_name, last_name, email, age, role } = user;

        res.status(200).json(
            {
                message: "Usuario encontrado",
                user: { first_name, last_name, email, age, role }
            }
        )
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/logout', requireJwtCookie, (req, res) => {
    try {
        res.clearCookie('access_token', { path: '/' });
        res.status(200).json({ message: "Logout Ok - Cookie de JWT Eliminada.!!" })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


export default router;