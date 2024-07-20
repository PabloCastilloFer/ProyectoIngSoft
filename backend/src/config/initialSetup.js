"use strict";
// Importa el modelo de datos 'Role'
import Facultade from "../models/facultade.model.js";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */
async function createRoles() {
  try {
    // Busca todos los roles en la base de datos
    const count = await Role.estimatedDocumentCount();
    // Si no hay roles en la base de datos los crea
    if (count > 0) return;

    await Promise.all([
      new Role({ name: "empleado" }).save(),
      new Role({ name: "supervisor" }).save(),
      new Role({ name: "admin" }).save(),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createFacultades
 * @returns {Promise<void>}
 */
async function createFacultades() {
  try {
    // Busca todos los roles en la base de datos
    const count = await Facultade.estimatedDocumentCount();
    // Si no hay roles en la base de datos los crea
    if (count > 0) return;

    await Promise.all([
      new Facultade({ name: "Facultad de Ciencias Empresariales" }).save(),
      new Facultade({ name: "Universidad" }).save(),
      new Facultade({ name: "Facultad de Arquitectura" }).save(),
    ]);
    console.log("* => Facultades creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers
 * @returns {Promise<void>}
 */
async function createUsers() {
  try {
    const count = await User.estimatedDocumentCount();
    if (count > 0) return;

    const admin = await Role.findOne({ name: "admin" });
    const supervisor = await Role.findOne({ name: "supervisor" });
    const empleado = await Role.findOne({ name: "empleado" });

    const Universidad = await Facultade.findOne({ name: "Universidad" });
    const CienciasEmpresariales = await Facultade.findOne({ name: "Facultad de Ciencias Empresariales" });
    const Arquitectura = await Facultade.findOne({ name: "Facultad de Arquitectura" });


    await Promise.all([
      new User({
        username: "empleadoCE",
        email: "empleadoCE@email.cl",
        rut: "23232323-0",
        password: await User.encryptPassword("empleado"),
        roles: empleado._id,
        facultades: CienciasEmpresariales._id,
      }).save(),
      new User({
        username: "Giuliano",
        email: "luis.acuna2101@alumnos.ubiobio.cl",
        rut: "20829012-6",
        password: await User.encryptPassword("empleado"),
        roles: empleado._id,
        facultades: CienciasEmpresariales._id,
      }).save(),
      new User({
        username: "Fernanda",
        email: "fernanda.shonffeldt2101@alumnos.ubiobio.cl",
        rut: "19599213-4",
        password: await User.encryptPassword("empleado"),
        roles: empleado._id,
        facultades: CienciasEmpresariales._id,
      }).save(),
      new User({
        username: "empleadoARQ",
        email: "empleadoARQ@email.cl",
        rut: "56565656-0",
        password: await User.encryptPassword("empleado"),
        roles: empleado._id,
        facultades: Arquitectura._id,
      }).save(),
      new User({
        username: "Ninoska",
        email: "ninoska.paredes2101@alumnos.ubiobio.cl",
        rut: "19815943-3",
        password: await User.encryptPassword("empleado"),
        roles: empleado._id,
        facultades: Arquitectura._id,
      }).save(),
      new User({
        username: "Pablo",
        email: "pablo.castillo2101@alumnos.ubiobio.cl",
        rut: "20738450-K",
        password: await User.encryptPassword("empleado"),
        roles: empleado._id,
        facultades: Arquitectura._id,
      }).save(),
      new User({
        username: "superviorARQ",
        email: "supervisorARQ@email.com",
        rut: "89898989-0",
        password: await User.encryptPassword("super"),
        roles: supervisor._id,
        facultades: Arquitectura._id,
      }).save(),
      new User({
        username: "Sebastian",
        email: "Sebastian@email.com",
        rut: "12312312-3",
        password: await User.encryptPassword("super"),
        roles: supervisor._id,
        facultades: Arquitectura._id,
      }).save(),
      new User({
        username: "SupervisorCE",
        email: "supervisorCE@email.com",
        rut: "47474747-0",
        password: await User.encryptPassword("super"),
        roles: supervisor._id,
        facultades: CienciasEmpresariales._id,
      }).save(),
      new User({
        username: "Alejandra",
        email: "Alejandra@email.com",
        rut: "32132132-1",
        password: await User.encryptPassword("super"),
        roles: supervisor._id,
        facultades: CienciasEmpresariales._id,
      }).save(),
      new User({
        username: "admin",
        email: "admin@email.com",
        rut: "12345678-0",
        password: await User.encryptPassword("admin"),
        roles: admin._id,
        facultades: Universidad._id,
      }).save(),
    ]);
    console.log("* => Users creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

export { createRoles, createFacultades, createUsers };
