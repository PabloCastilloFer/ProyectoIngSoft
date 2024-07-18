// src/components/TareaAsignadaList.jsx
import React, { useEffect, useState } from 'react';
import tareaRealizadaService from '../services/tareaRealizadaService';

const TareaAsignadaList = ({ rutUsuario }) => {
    const [tareas, setTareas] = useState([]);
    const [estado, setEstado] = useState('');

    useEffect(() => {
        fetchTareasAsignadas();
    }, [rutUsuario, estado]);

    const fetchTareasAsignadas = () => {
        let fetchFunction = tareaRealizadaService.obtenerTareasAsignadas;

        if (estado === 'completa') {
            fetchFunction = tareaRealizadaService.obtenerTareasCompletas;
        } else if (estado === 'incompleta') {
            fetchFunction = tareaRealizadaService.obtenerTareasIncompletas;
        } else if (estado === 'no-realizada') {
            fetchFunction = tareaRealizadaService.obtenerTareasNoRealizadas;
        }

        fetchFunction(rutUsuario)
            .then(response => {
                setTareas(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las tareas asignadas:", error);
            });
    };

    const handleEstadoChange = (e) => {
        setEstado(e.target.value);
    };

    return (
        <div>
            <h2>Tareas Asignadas</h2>
            <select value={estado} onChange={handleEstadoChange}>
                <option value="">Todas</option>
                <option value="completa">Completas</option>
                <option value="incompleta">Incompletas</option>
                <option value="no-realizada">No realizadas</option>
            </select>
            <ul>
                {tareas.map((tarea) => (
                    <li key={tarea.idTarea}>
                        <a href={`/tareas-asignadas/${tarea.idTarea}`}>{tarea.nombreTarea}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TareaAsignadaList;
