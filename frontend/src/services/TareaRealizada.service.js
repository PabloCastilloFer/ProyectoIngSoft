// src/services/tareaRealizadaService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tareaRealizada';

const crearTareaRealizada = (tareaRealizadaData) => {
    return axios.post(`${API_URL}/crear`, tareaRealizadaData);
};

const obtenerTareasRealizadas = () => {
    return axios.get(`${API_URL}/obtener`);
};

const obtenerTareasAsignadas = (rutUsuario) => {
    return axios.get(`${API_URL}/asignadas/${rutUsuario}`);
};

const obtenerTareasCompletas = (rutUsuario) => {
    return axios.get(`${API_URL}/completas/${rutUsuario}`);
};

const obtenerTareasIncompletas = (rutUsuario) => {
    return axios.get(`${API_URL}/incompletas/${rutUsuario}`);
};

const obtenerTareasNoRealizadas = (rutUsuario) => {
    return axios.get(`${API_URL}/no-realizadas/${rutUsuario}`);
};

export default {
    crearTareaRealizada,
    obtenerTareasRealizadas,
    obtenerTareasAsignadas,
    obtenerTareasCompletas,
    obtenerTareasIncompletas,
    obtenerTareasNoRealizadas,
};
