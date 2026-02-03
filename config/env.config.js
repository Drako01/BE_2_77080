import dotenv from 'dotenv';
dotenv.config();

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGO_TARGET: process.env.MONGO_TARGET || 'LOCAL',
    MONGO_URL: process.env.MONGO_URL || '',
    MONGO_ATLAS_URL: process.env.MONGO_ATLAS_URL || '',
    SECRET_SESSION: process.env.SECRET_SESSION || '',
    JWT_SECRET: process.env.JWT_SECRET || ''
}

export function validateEnv() {
    const missing = [];
    if (!env.SECRET_SESSION) missing.push('SECRET_SESSION');
    if (!env.JWT_SECRET) missing.push('JWT_SECRET');
    if (env.MONGO_TARGET === 'LOCAL' && !env.MONGO_URL) missing.push('MONGO_URL');
    if (env.MONGO_TARGET === 'ATLAS' && !env.MONGO_ATLAS_URL) missing.push('MONGO_ATLAS_URL');
    if(missing.length){
        console.error(`[ENV] Faltan variables de entorno obligatorias` , missing.join(', '));
        process.exit(1);
    }
}

export function getPublicEnv() {
    return {
        NODE_ENV: env.NODE_ENV,
        PORT: env.PORT,
        MONGO_TARGET: env.MONGO_TARGET
    }
}

export default env;