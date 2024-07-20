// src/components/TareaAsignadaDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import tareaRealizadaService from '../services/TareaRealizada.service';

const TareaAsignadaDetail = ({ rutUsuario }) => {
    const { id } = useParams();
    const navigate = useNavigate(); // Reemplazamos useHistory con useNavigate
    const [tarea, setTarea] = useState(null);
    const [comentario, setComentario] = useState('');
    const [estado, setEstado] = useState('completa'); // Estado por defecto a completa

    useEffect(() => {
        tareaRealizadaService.obtenerTareasAsignadas(rutUsuario)
            .then(response => {
                const tareaEncontrada = response.data.find(t => t.idTarea === id);
                setTarea(tareaEncontrada);
            })
            .catch(error => {
                console.error('Error al obtener la tarea asignada:', error);
            });
    }, [id, rutUsuario]);

    const handleComentarioChange = (e) => {
        setComentario(e.target.value);
    };

    const handleEstadoChange = (e) => {
        setEstado(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const tareaRealizadaData = {
            TareaID: id,
            comentario: comentario,
            estado: estado,
        };

        tareaRealizadaService.crearTareaRealizada(tareaRealizadaData)
            .then(() => {
                navigate('/tareas-asignadas'); // Reemplazamos history.push con navigate
            })
            .catch(error => {
                console.error('Error al completar la tarea:', error);
            });
    };

    if (!tarea) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Completar Tarea</h2>
            <p>Nombre: {tarea.nombreTarea}</p>
            <p>Descripción: {tarea.descripcionTarea}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Comentario:
                    <textarea name="comentario" value={comentario} onChange={handleComentarioChange} required />
                </label>
                <br />
                <label>
                    Estado:
                    <select name="estado" value={estado} onChange={handleEstadoChange}>
                        <option value="completa">Completa</option>
                        <option value="incompleta">Incompleta</option>
                        <option value="no-realizada">No realizada</option>
                    </select>
                </label>
                <br />
                <button type="submit">Completar Tarea</button>
            </form>
        </div>
    );
};

export default TareaAsignadaDetail;