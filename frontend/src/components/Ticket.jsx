import 'bulma/css/bulma.min.css';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar.jsx';
import axios from '../services/root.service.js';
import '../styles/Generico.css';  

export default function VerTicket() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleEdit = (TareaID) => {
        history.push(`/editar-ticket/${TareaID}`);
    };

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
    marginRight:'300px',
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
                <p><strong>Tarea ID:</strong> {ticket.TareaID}</p>
                <p><strong>Usuario Asignado:</strong> {ticket.RutAsignado}</p>
                <p><strong>Inicio:</strong> {new Date(ticket.Inicio).toLocaleString()}</p>
                <p><strong>Fin:</strong> {new Date(ticket.Fin).toLocaleString()}</p>
                <button className="button is-primary is-outlined" onClick={() => handleEdit(ticket.TareaID)} >
                    <span className="icon is-small">
                    </span>
                    <span>Reasignar</span>
                </button>
            </div>
        ))}
        </div>
    </div>
    );
};
