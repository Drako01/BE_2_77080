import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/backend77080');
        console.log(`✅ Conectado a MongoDB de Forma exitosa.!!`)
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

export const connectMongoAtlasDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/backend77080');
        console.log(`✅ Conectado a Mongo Atlas de Forma exitosa.!!`)
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}