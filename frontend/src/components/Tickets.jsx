import 'bulma/css/bulma.min.css';
import React, { useState, useEffect } from 'react';
import Navbar from './navbar.jsx';
import axios from '../services/root.service.js';
import '../styles/Tareas.css';
import { useNavigate } from 'react-router-dom';
import { showDeleteTicket, DeleteQuestion } from '../helpers/swaHelper.js';
import { deleteTicket } from '../services/ticket.service.js';

export default function VerTicket() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        axios.get(`/ticket/task/${searchQuery}`)
            .then((response) => {
                setTareas(response.data); 
            })
            .catch((error) => {
                console.error('Error al obtener las tareas filtradas:', error);
            });
    };
    const handleDeleted = async (ticketToDelete) => {
        const isConfirmed = await DeleteQuestion();
        if (isConfirmed) {
            const response = await deleteTicket(ticketToDelete);
            if (response.status === 200) {
                await showDeleteTicket();
            }
            window.location.reload();
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

    const handleEditClick = (ticket) => {
        navigate(`/ticket/modificar`, {
            state: { ticket },
        });
    };
    
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

    useEffect(() => {
    // Obtener todos los tickets al cargar el componente
    const fetchTickets = async () => {
        try {
        const response = await axios.get('/ticket'); // Asegúrate de que la ruta sea correcta
        setTickets(response.data);
        } catch (error) {
        console.error('Error al obtener los tickets', error);
        }
    };

    fetchTickets();
    }, []);

    useEffect(() => {
    // Filtrar los tickets basados en el término de búsqueda
    const results = tickets.filter(ticket =>
        ticket.TareaID.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTickets(results);
    }, [searchTerm, tickets]);

const containerStyle = {
    display: 'flex',
    marginRight:'250px',
    marginTop: '64px', // Ajustar para la altura de la navbar
    justifyContent: 'center',
    alignItems: 'center',
};

const BoxStyle = {
    alignItems: 'center',
    paddingTop: '64px', // Ajustar para la altura de la navbar
    width: '800px',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'left',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
};

const BoxStyle2 = {
    alignItems: 'center',
    paddingTop: '10px', // Ajustar para la altura de la navbar
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
        <h1 className="title is-2">Tareas asignadas</h1>
        </div>
        <form onSubmit={handleSearch} className="mb-4">
                    <div className="field has-addons">
                        <div className="control is-expanded">
                            <input
                                className="input"
                                type="text"
                                placeholder="Buscar tarea por ID..."
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
        {tickets
            .filter(ticket => new Date(ticket.Inicio) > new Date())
            .map((ticket, index) => (
            <div key={ticket._id} style={BoxStyle2}>
                <p><strong>Usuario Asignado:</strong> {ticket.RutAsignado}</p>
                <p><strong>Inicio:</strong> {new Date(ticket.Inicio).toLocaleString()}</p>
                <p><strong>Fin:</strong> {new Date(ticket.Fin).toLocaleString()}</p>
                <div className="button-container">
                <button
                        className="button is-primary is-outlined is-asignar"
                        onClick={() => handleEditClick(ticket)}
                    >
                        <span className="icon is-small">
                            <UserIcon />
                        </span>
                        <span>Reasignar</span>
                    </button>
                    <button
                            className="button is-danger is-outlined is-eliminar"
                            onClick={() => handleDeleted(ticket._id)}
                        >
                            <span className="icon is-small">
                            <TrashIcon />
                            </span>
                            <span>Desasignar</span>
                        </button>
                </div>
            </div>
        ))}
        </div>
    </div>
    );
};
