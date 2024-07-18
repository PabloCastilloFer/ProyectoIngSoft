import { Router } from "express";
import multer from 'multer';
import { crearTareaRealizada, obtenerTareasRealizadas, obtenerTareasAsignadas, obtenerTareasCompletas, obtenerTareasIncompletas, obtenerTareasNoRealizadas } from "../controllers/tareaRealizada.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isEmpleado } from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(authenticationMiddleware);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/upload/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Validación de que el archivo sea como máximo de 5 MB
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Solo se permiten archivos PDF'));
        }
        cb(null, true);
    }
});

const handleFileSizeLimit = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ message: "El tamaño del archivo excede el límite de 1 MB" });
    } else {
        next(err);
    }
};

// Crear una nueva tarea realizada
router.post('/:rutUsuario', upload.single("archivoAdjunto"), isEmpleado, crearTareaRealizada);

// Obtener todas las tareas realizadas
router.get('/', isEmpleado, obtenerTareasRealizadas);



// Obtener todas las tareas asignadas a un usuario
router.get('/asignadas/:rutUsuario', isEmpleado, obtenerTareasAsignadas);

// Obtener todas la tareas completadas por un usuario
router.get('/completadas/:rutUsuario', isEmpleado, obtenerTareasCompletas);

// Obtener todas las tareas incompletas por un usuario
router.get('/incompletas/:rutUsuario', isEmpleado, obtenerTareasIncompletas);

// Obtener todas las tareas no realizadas por un usuario
router.get('/noRealizadas/:rutUsuario', isEmpleado, obtenerTareasNoRealizadas);

export default router;
