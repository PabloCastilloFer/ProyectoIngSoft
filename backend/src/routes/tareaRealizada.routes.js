import { Router } from "express";
import multer from 'multer';
import { crearTareaRealizada, obtenerTareasRealizadas, obtenerTareasAsignadas, obtenerTareasCompletas, obtenerTareasIncompletas, obtenerTareasNoRealizadas,getArchivos } from "../controllers/tareaRealizada.controller.js";
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

// Obtener todas las tareas realizadas de un empleado
router.get('/:rutUsuario', isEmpleado, obtenerTareasRealizadas);


// Obtener todas las tareas asignadas a un empleado
router.get('/asignadas/:rutUsuario', isEmpleado, obtenerTareasAsignadas);

// Obtener todas la tareas completadas por un empleado
router.get('/:rutUsuario/completadas', isEmpleado, obtenerTareasCompletas);

// Obtener todas las tareas incompletas por un empleado
router.get('/:rutUsuario/incompletas', isEmpleado, obtenerTareasIncompletas);

// Obtener todas las tareas no realizadas por un empleado
router.get('/:rutUsuario/noRealizadas', isEmpleado, obtenerTareasNoRealizadas);


router.get('/src/upload/:filename', isEmpleado,getArchivos) //RUTA PARA OBTENER ARCHIVOS
export default router;