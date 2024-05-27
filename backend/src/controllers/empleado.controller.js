// empleado.controller.js
import User from '../models/user.model.js';
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { userIdSchema } from "../schema/user.schema.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los empleados
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await User.find().populate('facultades roles');
    empleados.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, empleados);
  } catch (error) {
    handleError(error, "empleado.controller -> getEmpleados");
    respondError(req, res, 500, error.message);
  }
};

/**
 * Obtiene un empleado por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
export const getEmpleadoById = async (req, res) => {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const empleado = await User.findById(params.id).populate('facultades roles');
    if (!empleado) {
      return respondError(req, res, 404, "Empleado no encontrado");
    }
    respondSuccess(req, res, 200, empleado);
  } catch (error) {
    handleError(error, "empleado.controller -> getEmpleadoById");
    respondError(req, res, 500, "No se pudo obtener el empleado");
  }
};
