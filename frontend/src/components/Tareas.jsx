import 'bulma/css/bulma.min.css';
import { useState, useEffect } from 'react';
import { getAllTareas, deleteTarea } from '../services/tarea.service.js';
import { showDeleteTarea , DeleteQuestion } from '../helpers/swaHelper.js';
import Navbar from '../components/navbar.jsx';
import axios from '../services/root.service.js';

export default function VerTareas() {
    const [tareas, setTareas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('/tarea')
            .then((response) => {
                setTareas(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener las tareas:', error);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        axios.get(`/tarea?nombreTarea=${searchQuery}`)
            .then((response) => {
                setTareas(response.data); 
            })
            .catch((error) => {
                console.error('Error al obtener las tareas filtradas:', error);
            });
    };

    const handleDeleted = async (tareaToDelete) => {
        const isConfirmed = await DeleteQuestion();
        console.log(isConfirmed)
        if (isConfirmed) {
        const response = await deleteTarea(tareaToDelete);
        if (response.status === 200) {
            await showDeleteTarea();
        }
        window.location.reload();
        }
    };

    const handleArchivo = async (url) => {
        try {
        const prot = '';
        const uniqueTimestamp = new Date().getTime();
        const Url =  `${prot}${url}?timestamp=${uniqueTimestamp}`;

        const fileContent = await getArchive(Url);

        const blob = new Blob([fileContent], { type: 'application/pdf' });

        const fileUrl = URL.createObjectURL(blob);

        window.open(fileUrl, '_blank');
        } catch (error) {
        console.error('Error al hacer la solicitud:', error.message);
        }
    };

    const handleEdit = (tareaId) => {
        history.push(`/editar-tarea/${tareaId}`);
    };

    const TrashIcon = (props) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    );

    function PencilIcon(props) {
        return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
        )
    }

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        marginRigth: '300px',
    };

    const BoxStyle = {
        width: '1200px',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
    };

    const BoxStyle2 = {
        width: '1135px',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
    };

    return (
        <div style={containerStyle}>
            <Navbar />
            <div style={BoxStyle}>
                <div className="has-text-centered">
                    <h1 className="title is-2">Lista de Tareas</h1>
                </div>
                <form onSubmit={handleSearch} className="mb-4">
                    <div className="field has-addons">
                        <div className="control is-expanded">
                            <input
                                className="input"
                                type="text"
                                placeholder="Buscar tarea por nombre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="control">
                            <button type="submit" className="button is-info">
                                Buscar
                            </button>
                        </div>
                    </div>
                </form>
                {tareas.map((tarea, index) => (
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
                        <div className="buttons">
                            <button 
                                className="button is-danger is-outlined mr-2" 
                                onClick={() => handleDeleted(tarea.idTarea)}
                            >
                                <span className="icon is-small">
                                    <TrashIcon />
                                </span>
                                <span>Eliminar</span>
                            </button>
                            <button 
                                className="button is-primary is-outlined" 
                                onClick={() => handleEdit(tarea.idTarea)}
                            >
                                <span className="icon is-small">
                                    <PencilIcon />
                                </span>
                                <span>Editar Tarea</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
