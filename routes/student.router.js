import { Router } from "express";
import { Student } from '../config/models/student.model.js';
import mongoose from "mongoose";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ "students": students });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let { name, email, age } = req.body;
        if (!name || !email || !age) {
            res.status(400).json({ error: "Todos los datos son requeridos" });
        };

        email = String(email).trim().toLowerCase();
        const emailInUse = await Student.exists({ email });
        if (emailInUse) {
            res.status(400).json({ error: `El email ${email} ya esta en uso por otro estudiante` });
        }

        const student = new Student({ name, email, age });
        await student.save();


        res.status(201).json({ message: "Estudiante creado con exito.!!", student: student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Formato de ID invalido" });
        }
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: `El Estudiante con ID ${req.params.id} ne existe.!!` });
        res.status(200).json({ "student": student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Formato de ID invalido" });
        }
        let { name, email, age } = req.body;
        if (!name || !email || !age) {
            res.status(400).json({ error: "Todos los datos son requeridos" });
        };

        email = String(email).trim().toLowerCase();
        const emailInUse = await Student.exists({ email });
        if (emailInUse) {
            res.status(400).json({ error: `El email ${email} ya esta en uso por otro estudiante` });
        }
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!student) return res.status(404).json({ error: `El Estudiante con ID ${req.params.id} ne existe.!!` });
        res.status(200).json({ message: "Estudiante actualizado con exito", student: student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Formato de ID invalido" });
        }
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: `El Estudiante con ID ${req.params.id} ne existe.!!` });
        res.status(204).json(); // No Content
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;