import jwt from 'jsonwebtoken';
import passport from 'passport';

export function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not Authorized" });
    }
    next();
}

export function alreadyLogin(req, res, next) {
    if (req.session.user) {
        return res.status(403).json({ error: "Ya estas logueado.!" })
    }
    next();
}

// Autorizacion por Role
export function requireRole(role) {
    return (req, res, next) => {
        const user = req.session?.user || req.user; // Session o Passport
        if (!user) return res.status(401).json({ error: "Not Authorized" });
        if (user.role !== role) res.status(403).json({ error: "Forbbiden" });
        next();
    }
}

// Require passport-jwt leyendo la cookie de acces_token
export const requireJwtCookie = passport.authenticate('jwt-cookie', {session: false});

// Autorizacion por Roles
export function requireManyRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: "Not Authorized" });
        if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbbiden" });
        next();
    }
}


export function requiereJWT(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Token faltante" });
    try {
        req.jwt = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: "Token inválido/expirado" });
    }
}