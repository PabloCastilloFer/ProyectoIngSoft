import { Router } from "express";
import multer from 'multer';
import { createTarea , getTareas , getTarea , deleteTarea , updateTarea , updateNewTarea } from "../controllers/tarea.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isSupervisor } from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(authenticationMiddleware);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/upload/'); // Se define la carpeta de destino donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Configurar Multer con la configuración y el filtro de archivos
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 *1024 // Validación de que el archivo sea como máximo de 5 MB
    }
});

// Middleware para manejar el error de límite de tamaño de archivo
const handleFileSizeLimit = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ message: "El tamaño del archivo excede el límite de 1 MB" });
    } else {
        next(err);
    }
};

router.post('/', upload.single("archivo"), isSupervisor, createTarea);
router.get('/', isSupervisor, getTareas);
router.get('/:nombreTarea', isSupervisor, getTarea);
router.delete('/:nombreTarea', isSupervisor, deleteTarea);
router.put('/:nombreTarea', isSupervisor, updateTarea); //modificar nombretarea por idtarea
router.post('/:nombreTarea', upload.single("archivo"), isSupervisor, updateNewTarea); //modificar nombretarea por idtarea
router.use(handleFileSizeLimit); // Aplicar middleware para manejar el error de límite de tamaño de archivo


export default router;