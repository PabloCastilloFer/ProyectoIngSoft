import express from "express";
import { EmpleadoController } from "../controllers/empleado.controller.js";

const router = express.Router();

// Rutas para crear un empleado
router.post("/empleado", EmpleadoController.crearEmpleado);

// Ruta para listar todos los empleados
router.get("/empleado", EmpleadoController.listarEmpleados);

// Ruta para modificar un empleado por su ID
router.put("/empleado/:id", EmpleadoController.modificarEmpleado);

// Ruta para eliminar un empleado por su ID
router.delete("/empleado/:id", EmpleadoController.eliminarEmpleado);

export default router;
