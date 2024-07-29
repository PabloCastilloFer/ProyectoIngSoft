import 'bulma/css/bulma.min.css';
import { useState, useEffect } from 'react';
import { deleteTarea } from '../services/tarea.service.js';
import { showDeleteTarea, DeleteQuestion , showNoAsignada , showNoEntregada, showNoRevisada , showNoEnRevision, showNoEntregadaEliminada , showRevisadaEliminada, showAsignadaEliminada, showRevisionEliminada} from '../helpers/swaHelper.js';
import Navbar from '../components/navbar.jsx';
import axios from '../services/root.service.js';
import { useNavigate } from 'react-router-dom';
import { getArchive } from '../services/archive.service.js';
import '../styles/Tareas.css';

export default function VerTareas() {
    const navigate = useNavigate();
    const [tareas, setTareas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const email = JSON.parse(localStorage.getItem('user')).email;

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredTareas = tareas.filter(tarea =>
        tarea.nombreTarea.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleted = async (tarea) => {
        if (tarea.estado === 'asignada') {
            showAsignadaEliminada();
        } else if (tarea.estado === 'entregada') {
            showNoEntregadaEliminada();
        } else if (tarea.estado === 'revisada') {
            showRevisadaEliminada();
        } else if (tarea.estado === 'en revision') {
            showRevisionEliminada();
        } else {
        const isConfirmed = await DeleteQuestion();
        if (isConfirmed) {
            const response = await deleteTarea(tarea.idTarea);
            if (response.status === 200) {
                await showDeleteTarea();
            }
            window.location.reload();
        }
    }
};
    
    const handleAsignarClick = (tarea) => {
        navigate(`/ticket`, {
            state: { tarea },
        });
    };

    const handleEditClick = (tarea) => {
        if(tarea.estado === 'asignada'){
            showNoAsignada();
        }else if(tarea.estado === 'finalizada'){
            showNoEntregada();
        }else if(tarea.estado === 'revisada'){
            showNoRevisada();
        }else if(tarea.estado === 'en revision'){
            showNoEnRevision();
        }else {
            navigate(`/tarea/modificar`, {
                state: { tarea },
            });
        }
    };

    const handleDuplicarClick = (tarea) => {
        navigate(`/tarea/duplicar`, {
            state: { tarea },
        });
    }

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

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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

    function UserIcon(props) {
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
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20c0-4 4-6 6-6s6 2 6 6" />
            </svg>
        );
    }

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

    function CopyIcon(props) {
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
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
        );
    }
 
      function DownloadIcon(props) {
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
        );
    }

    const containerStyle = {
        display: 'flex',
        marginRight:'250px',
        marginTop: '64px',
        justifyContent: 'center',
        alignItems: 'center',
    };
    
    const BoxStyle = {
        alignItems: 'center',
        paddingTop: '64px',
        width: '800px',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'left',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    };
    
    const BoxStyle2 = {
        alignItems: 'center',
        paddingTop: '10px',
        padding: '1rem',
        borderRadius: '10px',
        textAlign: 'left',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#fff',
        marginBottom: '10px',
    };

    return (
        <div style={containerStyle}>
        <Navbar />
        <div style={BoxStyle}>
                <div className="has-text-centered">
                    <h1 className="title is-2">Lista de tareas</h1>
                </div>
                <div>
                    <div className="field">
                        <label className="label" htmlFor="search">Filtrar por nombre:</label>
                        <div className="control">
                            <input
                                id="search"
                                type="text"
                                className="input search-input"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Buscar por nombre de tarea..."
                            />
                        </div>
                    </div>
                    {filteredTareas.length === 0 ? (
                        <p>No hay tareas existentes con ese nombre.</p>
                    ) : (
                        filteredTareas.reverse().map((tarea, index) => (
                            <div key={index} style={BoxStyle2}>
                                <div className="content">
                                    <h2 className="title is-4">{capitalizeFirstLetter(tarea.nombreTarea)}</h2>
                                    <div className="contenedor-texto">
                                        <strong>Tipo:</strong>&nbsp;
                                        <span>{capitalizeFirstLetter(tarea.tipoTarea)}</span>
                                    </div>
                                    <div className="contenedor-texto">
                                        <strong>Estado:</strong>&nbsp;
                                        <span>{capitalizeFirstLetter(tarea.estado)}</span>
                                    </div>
                                    <div className="contenedor-texto">
                                        <strong>Descripción:</strong>&nbsp;
                                        <span>{capitalizeFirstLetter(tarea.descripcionTarea)}</span>
                                    </div>
                                    <p className="is-flex is-align-items-center">
                                        <strong>Archivo adjunto:</strong>&nbsp;
                                        {tarea.archivo ? (
                                            <>
                                                <button
                                                    className="button-download is-descargar"
                                                    onClick={() => handleArchivo(tarea.archivo)}
                                                >
                                                    <span className="icon is-small">
                                                <DownloadIcon />
                                            </span>
                                            <span>Descargar archivo</span>
                                                </button>
                                            </>
                                        ) : (
                                            <span className="ml-2">No hay archivo adjunto</span>
                                        )}
                                    </p>
                                    <div className="button-container">
                                    {tarea.estado === 'nueva' && tarea.userEmail === email && (
                                        <button
                                            className="button is-primary is-outlined is-asignar"
                                            onClick={() => handleAsignarClick(tarea)}
                                        >
                                            <span className="icon is-small">
                                                <UserIcon />
                                            </span>
                                            <span>Asignar</span>
                                        </button>
                                    )}
                                    {tarea.userEmail === email && (
                                        <button
                                            className="button is-primary is-outlined is-asignar"
                                            onClick={() => handleEditClick(tarea)}
                                        >
                                            <span className="icon is-small">
                                                <PencilIcon />
                                            </span>
                                            <span>Editar</span>
                                        </button>
                                    )}
                                        <button
                                            className="button is-warning is-outlined is-duplicar"
                                            onClick={() => handleDuplicarClick(tarea)}
                                        >
                                            <span className="icon is-small">
                                                <CopyIcon />
                                            </span>
                                            <span>Duplicar</span>
                                        </button>
                                        {tarea.userEmail === email && (
                                        <button
                                            className="button is-danger is-outlined mr-2 is-eliminar"
                                            onClick={() => handleDeleted(tarea)}
                                        >
                                            <span className="icon is-small">
                                                <TrashIcon />
                                            </span>
                                            <span>Eliminar</span>
                                        </button>
                                    )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}