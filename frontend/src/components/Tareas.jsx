import 'bulma/css/bulma.min.css';
import { useState, useEffect } from 'react';
import { deleteTarea } from '../services/tarea.service.js';
import { showDeleteTarea, DeleteQuestion , showNoSePuedeEditar} from '../helpers/swaHelper.js';
import Navbar from '../components/navbar.jsx';
import axios from '../services/root.service.js';
import { useNavigate } from 'react-router-dom';
import { getArchive } from '../services/archive.service.js';

export default function VerTareas() {
    const navigate = useNavigate();
    const [tareas, setTareas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('/tarea')
            .then((response) => {
                setTareas(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener las tareas:', error);
            });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredTareas = tareas.filter(tarea =>
        tarea.nombreTarea.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleted = async (tareaToDelete) => {
        const isConfirmed = await DeleteQuestion();
        if (isConfirmed) {
            const response = await deleteTarea(tareaToDelete);
            if (response.status === 200) {
                await showDeleteTarea();
            }
            window.location.reload();
        }
    };

    const handleEditClick = (tarea) => {
        if(tarea.estado === 'asignada'|| tarea.estado === 'finalizada'|| tarea.estado === 'revisada'|| tarea.estado === 'en revision'){
            showNoSePuedeEditar();
        }else {
        navigate(`/tarea/modificar`, {
            state: { tarea },
        });
        }
    };

    const handleArchivo = async (url) => {
        try {
            const data = await getArchive(url);
            const extension = url.split('.').pop().split(/\#|\?/)[0];
            const blob = new Blob([data], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `archivo.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error al manejar el archivo:', error.message);
        }
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
        );
    }

    return (
        <div className="container">
            <Navbar />
            <div className="max-w-4xl mx-auto p-4">
                <div className="has-text-centered">
                    <h1 className="title is-2">Lista de tareas</h1>
                </div>
                <div className="field">
                    <label className="label" htmlFor="search">Filtrar por nombre:</label>
                    <div className="control">
                        <input
                            id="search"
                            type="text"
                            className="input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Buscar por nombre de tarea..."
                        />
                    </div>
                </div>
                {filteredTareas.length === 0 ? (
                    <p>No hay tareas asignadas.</p>
                ) : (
                    filteredTareas.map((tarea, index) => (
                        <div key={index} className="box">
                            <div className="content">
                                <h2 className="title is-4">{tarea.nombreTarea}</h2>
                                <p><strong>Tipo:</strong> {tarea.tipoTarea}</p>
                                <p><strong>Descripción:</strong> {tarea.descripcionTarea}</p>
                                <p><strong>Estado:</strong> {tarea.estado}</p>
                                <p className="is-flex is-align-items-center">
                                    <strong>Archivo adjunto:</strong>
                                    {tarea.archivo ? (
                                        <>
                                            <button
                                                className="button is-info is-small ml-2"
                                                onClick={() => handleArchivo(tarea.archivo)}
                                            >
                                                Descargar Archivo
                                            </button>
                                        </>
                                    ) : (
                                        <span className="ml-2">No hay archivo adjunto</span>
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
                                        onClick={() => handleEditClick(tarea)}
                                    >
                                        <span className="icon is-small">
                                            <PencilIcon />
                                        </span>
                                        <span>Editar Tarea</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
