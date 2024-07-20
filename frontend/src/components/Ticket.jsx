import 'bulma/css/bulma.min.css';
import React, { useState, useEffect } from 'react';
import { getTicket } from '../services/ticket.service.js';
import Navbar from '../components/navbar.jsx';
import axios from '../services/root.service.js';
import '../styles/Generico.css';  

export default function VerTicket() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);

    useEffect(() => {
    // Obtener todos los tickets al cargar el componente
    const fetchTickets = async () => {
        try {
        const response = await axios.get('/ticket/**'); // Asegúrate de que la ruta sea correcta
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
        <h1>Buscar Ticket</h1>
        <input
        type="text"
        placeholder="Buscar por ID de Tarea"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        />
        <div>
        {filteredTickets.map(ticket => (
            <div key={ticket._id}>
            <p>Tarea ID: {ticket.TareaID}</p>
            <p>Usuario Asignado: {ticket.RutAsignado}</p>
            <p>Inicio: {new Date(ticket.Inicio).toLocaleString()}</p>
            <p>Fin: {new Date(ticket.Fin).toLocaleString()}</p>
            </div>
        ))}
        </div>
    </div>
    </div>
    );
};
