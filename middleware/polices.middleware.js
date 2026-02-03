export const polices = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not Authorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbbiden" });
    next();
}