import 'bulma/css/bulma.min.css';
import { useState, useEffect } from 'react';
import axios from '../services/root.service.js';
import Navbar from '..components/navbar.jsx';

export default function VerTicket() {
    const [tareasConTicket, setTareasConTicket] = useState([]);

    useEffect(() => {
        fetchTareasConTicket();
    }, []);

    const fetchTareasConTicket = () => {
        axios.get('/tareas/conticket')
            .then((response) => {
                setTareasConTicket(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener las tareas con ticket:', error);
            });
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '250px', // Ajustar el margen según el estado de la barra lateral
    };

    const BoxStyle = {
        alignItems: 'center',
        paddingTop: '64px', // Ajustar para la altura de la navbar
        width: '1500px',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
    };

    const BoxStyle2 = {
        alignItems: 'left',
        paddingTop: '40px', // Ajustar para la altura de la navbar
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 5px 5px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
    };

    return (
        <div style={containerStyle}>
            <Navbar />
            <div style={BoxStyle}>
                <div className="has-text-centered">
                    <h1 className="title is-2">Tareas Asignadas (con Ticket)</h1>
                </div>
                {tareasConTicket.map((tarea, index) => (
                    <div key={tarea.idTarea} style={BoxStyle2}>
                        <h2 className="title is-4">{tarea.nombreTarea}</h2>
                        <p><strong>Tipo:</strong> {tarea.tipoTarea}</p>
                        <p><strong>Descripción:</strong> {tarea.descripcionTarea}</p>
                        <p><strong>Estado:</strong> {tarea.estado}</p>
                        <p><strong>ID:</strong> {tarea.idTarea}</p>
                        <p>
                            <strong>Archivo adjunto:</strong> {tarea.archivo ? tarea.archivo : 'No hay archivo adjunto'}
                            {tarea.archivo && (
                                <a 
                                    href={tarea.archivo} 
                                    className="button is-link is-small ml-2" 
                                    download
                                >
                                    Descargar
                                </a>
                            )}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
