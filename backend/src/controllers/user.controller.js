"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import UserService from "../services/user.service.js";
import { userBodySchema, userIdSchema } from "../schema/user.schema.js";
import { handleError } from "../utils/errorHandler.js";
import User from '../models/user.model.js';
import Facultade from '../models/facultade.model.js';
import Role from '../models/role.model.js';

/**
 * Obtiene todos los usuarios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getUsers(req, res) {
  try {
    const [usuarios, errorUsuarios] = await UserService.getUsers();
    if (errorUsuarios) return respondError(req, res, 404, errorUsuarios);

    usuarios.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, usuarios);
  } catch (error) {
    handleError(error, "user.controller -> getUsers");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea un nuevo usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createUser(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = userBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [newUser, userError] = await UserService.createUser(body);

    if (userError) return respondError(req, res, 400, userError);
    if (!newUser) {
      return respondError(req, res, 400, "No se creo el usuario");
    }

    respondSuccess(req, res, 201, newUser);
  } catch (error) {
    handleError(error, "user.controller -> createUser");
    respondError(req, res, 500, "No se creo el usuario");
  }
}

/**
 * Obtiene un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getUserById(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [user, errorUser] = await UserService.getUserById(params.id);

    if (errorUser) return respondError(req, res, 404, errorUser);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> getUserById");
    respondError(req, res, 500, "No se pudo obtener el usuario");
  }
}

/**
 * Actualiza un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateUser(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { error: bodyError } = userBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [user, userError] = await UserService.updateUser(params.id, body);

    if (userError) return respondError(req, res, 400, userError);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> updateUser");
    respondError(req, res, 500, "No se pudo actualizar el usuario");
  }
}

/**
 * Elimina un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteUser(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const user = await UserService.deleteUser(params.id);
    !user
      ? respondError(
          req,
          res,
          404,
          "No se encontro el usuario solicitado",
          "Verifique el id ingresado",
        )
      : respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> deleteUser");
    respondError(req, res, 500, "No se pudo eliminar el usuario");
  }
}

/**
 * Busca un usuario por su RUT y devuelve su correo electrónico.
 * @param {string} rut El RUT del usuario a buscar.
 * @returns {Promise<string|null>} El correo electrónico del usuario o null si no se encuentra.
 */
async function findUserByRut(req, res) {
  try {
    const rut = req.params.rut; // Extrae el RUT de los parámetros de la ruta
    console.log(`Buscando usuario con RUT: ${rut}`); // Agregar console.log aquí

    const user = await User.findOne({ rut: rut }).populate('roles').exec();
    console.log("Resultado de la búsqueda:", user); // Agregar console.log aquí

    if (user) {
      console.log("Usuario encontrado:", user); // Agregar console.log aquí
      res.status(200).send(user); // Envía el correo electrónico del usuario como respuesta
    } else {
      console.log("Usuario no encontrado"); // Agregar console.log aquí
      res.status(404).send("Usuario no encontrado"); // Envía un mensaje de error si el usuario no se encuentra
    }
  } catch (error) {
    console.error('Error buscando al usuario por RUT:', error);
    res.status(500).send("Error interno del servidor"); // Envía un mensaje de error en caso de un error del servidor
  }
}


/**
 * Busca usuarios por su facultad y devuelve una lista de usuarios.
 * @param {string} faculty La facultad de los usuarios a buscar.
 * @returns {Promise<Array|Error>} Una lista de usuarios o un error si no se encuentra.
 */
async function findUsersByFaculty(req, res) {
  try {
    const faculty = req.params.faculty; // Asumiendo que la facultad se pasa como parámetro en la URL
    const users = await User.find({ faculty: faculty }).exec(); // Asumiendo que el modelo de usuario tiene un campo `faculty`
    
    if (!users || users.length === 0) {
      return res.status(404).send({
        message: "No se encontraron usuarios para la facultad especificada"
      });
    }
    
    return res.status(200).send(users);
  } catch (error) {
    console.error('Error buscando usuarios por facultad:', error);
    return res.status(500).send({
      message: "Error interno al buscar usuarios por facultad"
    });
  }
}

/**
 * Busca usuarios por su rol y devuelve una lista de usuarios.
 * @param {string} role El rol de los usuarios a buscar.
 * @returns {Promise<Array|Error>} Una lista de usuarios o un error si no se encuentra.
 */
async function findUsersByRole(req, res) {
  try {
    const role = req.params.role; // Asumiendo que el rol se pasa como parámetro en la URL
    const users = await User.find({ role: role }).exec(); // Asumiendo que el modelo de usuario tiene un campo `role`
    
    if (!users || users.length === 0) {
      return res.status(404).send({
        message: "No se encontraron usuarios para el rol especificado"
      });
    }
    
    return res.status(200).send(users);
  } catch (error) {
    console.error('Error buscando usuarios por rol:', error);
    return res.status(500).send({
      message: "Error interno al buscar usuarios por rol"
    });
  }
}

export default {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  findUserByRut,
  findUsersByFaculty,
  findUsersByRole,
 
};
