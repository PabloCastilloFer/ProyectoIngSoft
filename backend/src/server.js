// Importa el archivo 'configEnv.js' para cargar las variables de entorno
import { PORT, HOST } from "./config/configEnv.js";
// Importa el módulo 'cors' para agregar los cors
import cors from "cors";
// Importa el módulo 'express' para crear la aplicacion web
import express, { urlencoded, json } from "express";
// Importamos morgan para ver las peticiones que se hacen al servidor
import morgan from "morgan";
// Importa el módulo 'cookie-parser' para manejar las cookies
import cookieParser from "cookie-parser";
/** El enrutador principal */
import indexRoutes from "./routes/index.routes.js";
// Importa el archivo 'configDB.js' para crear la conexión a la base de datos
import { setupDB } from "./config/configDB.js";
// Importa el handler de errores
import { handleFatalError, handleError } from "./utils/errorHandler.js";
import { createFacultades, createRoles, createUsers } from "./config/initialSetup.js";
import cron from 'node-cron'; // Importa cron
import TareaRealizada from './models/tareaRealizada.model.js'; // Importa el modelo TareaRealizada
import Ticket from './models/ticket.model.js'; // Importa el modelo Ticket

// Función para marcar tareas no realizadas
const marcarTareasNoRealizadas = async () => {
    try {
        const now = new Date();
        const tickets = await Ticket.find({ Fin: { $lt: now } });

        for (const ticket of tickets) {
            const tareaRealizada = await TareaRealizada.findOne({ tarea: ticket.TareaID, ticket: ticket.RutAsignado });

            if (!tareaRealizada) {
                const nuevaTareaNoRealizada = new TareaRealizada({
                    tarea: ticket.TareaID,
                    ticket: ticket.RutAsignado,
                    estado: 'no realizada',
                    comentario: 'Tarea no realizada en el tiempo establecido'
                });

                await nuevaTareaNoRealizada.save();
                console.log(`Tarea ${ticket.TareaID} marcada como no realizada.`);
            }
        }
    } catch (error) {
        console.error('Error al marcar tareas no realizadas:', error);
    }
};

// Programar tarea para que se ejecute cada minuto (o ajusta según necesites)
cron.schedule('* * * * *', () => {
    console.log('Ejecutando tarea programada para marcar tareas no realizadas');
    marcarTareasNoRealizadas();
});

/**
 * Inicia el servidor web
 */
async function setupServer() {
  try {
    /** Instancia de la aplicacion */
    const server = express();
    server.disable("x-powered-by");
    // Agregamos los cors
    server.use(cors({ credentials: true, origin: true }));
    // Agrega el middleware para el manejo de datos en formato URL
    server.use(urlencoded({ extended: true }));
    // Agrega el middleware para el manejo de datos en formato JSON
    server.use(json());
    // Agregamos el middleware para el manejo de cookies
    server.use(cookieParser());
    // Agregamos morgan para ver las peticiones que se hacen al servidor
    server.use(morgan("dev"));
    // Agrega el enrutador principal al servidor
    server.use("/api", indexRoutes);

    // Inicia el servidor en el puerto especificado
    server.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (err) {
    handleError(err, "/server.js -> setupServer");
  }
}

/**
 * Inicia la API
 */
async function setupAPI() {
  try {
    // Inicia la conexión a la base de datos
    await setupDB();
    // Inicia el servidor web
    await setupServer();
    // Inicia la creación de los roles
    await createRoles();
    // Inicia la creación de los facultades
    await createFacultades();
    // Inicia la creación del usuario admin y user
    await createUsers();
  } catch (err) {
    handleFatalError(err, "/server.js -> setupAPI");
  }
}

// Inicia la API
setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((err) => handleFatalError(err, "/server.js -> setupAPI"));
