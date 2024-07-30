import { Router } from "express";
import multer from 'multer';
import { createTarea , getTareas , getTarea , updateTarea, updateNewTarea, deleteTareaById, getArchives, getTareasUsuario} from "../controllers/tarea.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isSupervisor } from "../middlewares/authorization.middleware.js";
import { isEmSu } from "../middlewares/authorization.middleware.js";
const router = Router();
router.use(authenticationMiddleware);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/upload/'); 
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

router.use(handleFileSizeLimit); // Aplicar middleware para manejar el error de límite de tamaño de archivo
router.post('/', isSupervisor,upload.single("archivo"), createTarea);
router.get('/', isSupervisor, getTareas);
router.get('/:nombreTarea', isSupervisor, getTarea);
router.get('/mi-tarea/:email', isSupervisor ,getTareasUsuario);
router.get('/src/upload/:filename', isEmSu, getArchives);  //RUTA PARA OBTENER ARCHIVOS
router.put('/:idTarea', upload.single("archivo"),isSupervisor, updateTarea);
router.post('/:idTarea', upload.single("archivo"), isSupervisor, updateNewTarea);
router.delete('/:idTarea', isSupervisor, deleteTareaById);


export default router;