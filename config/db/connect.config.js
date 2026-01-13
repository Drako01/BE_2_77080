import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();



export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`✅ Conectado a MongoDB de Forma exitosa.!!`)
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

export const connectMongoAtlasDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_ATLAS_URL);
        console.log(`✅ Conectado a Mongo Atlas de Forma exitosa.!!`)
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}