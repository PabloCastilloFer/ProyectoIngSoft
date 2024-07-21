import 'bulma/css/bulma.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError, showConfirmFormTicket, CreatedTicket, VolverQuestion } from '../helpers/swaHelper.js';
import { useForm } from 'react-hook-form'; 
import { createTicket } from '../services/ticket.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from './navbar.jsx';

export default function FormTicket() {
    const navigate = useNavigate(); 

    const jwt = useAuth();

    const userStorage = localStorage.getItem('user');
    const userDat = JSON.parse(userStorage); 
    
    const [isLoading, setIsLoading] = useState(false);
    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const isConfirmed = await CreatedTicket();
            if (!isConfirmed) {
                return;
            }
            setIsLoading(true);
            const formData = new FormData();
            formData.append("TareaID", data.TareaID);
            formData.append("RutAsignado", data.RutAsignado);
            formData.append("Inicio", data.Inicio);
            formData.append("Fin", data.Fin);
            console.log(formData)

            const response = await createTicket(formData);
            console.log(response)
            if (response.status === 201) {
                await showConfirmFormTicket();
                reset();
            } else if (response.status === 400) {
                await showError(response.data[0].response.data.message);
            } else if (response.status === 500) {
                await showError(response.data[0].response.data.message);
            }
            console.log(response);
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVolver = () => {
        VolverQuestion();
        navigate(-1); 
    };

    function ArrowLeftIcon(props) {
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
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
            </svg>
        );
    }

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '250px', 
    };

    const BoxStyle = {
        alignItems: 'center',
        paddingTop: '64px', 
        width: '700px',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
        position: 'relative', 
    };

    const volverButtonStyle = {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
    };

    return (
        <div style={containerStyle}>
            <Navbar />
            <div style={BoxStyle}>
                <div style={volverButtonStyle}>
                    <button className="button is-light" onClick={handleVolver}>
                        <span className="icon is-small">
                            <ArrowLeftIcon />
                        </span>
                        <span>Volver</span>
                    </button>
                </div>
                <div>
                    <h2 className="title is-4">Formulario para asignar tarea</h2>
                    <p className="subtitle is-6">Ingresa los detalles del horario</p>
                    <div className="columns is-centered">
                        <div className="column is-two-thirds">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="field">
                                    <label className="label" htmlFor="TareaID">ID de la Tarea:</label>
                                    <div className="control">
                                        <input
                                            id="TareaID"
                                            type="text"
                                            placeholder="Ej. 12345"
                                            className={`input ${errors.TareaID ? 'is-danger' : ''}`}
                                            {...register('TareaID', { required: true })}
                                        />
                                    </div>
                                    {errors.tareaID && <p className="help is-danger">Este campo es obligatorio</p>}
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="RutAsignado">RUT Asignado:</label>
                                    <div className="control">
                                        <input
                                            id="RutAsignado"
                                            type="text"
                                            placeholder="Ej. 12345678-9"
                                            className={`input ${errors.RutAsignado ? 'is-danger' : ''}`}
                                            {...register('RutAsignado', { required: true })}
                                        />
                                    </div>
                                    {errors.rutAsignado && <p className="help is-danger">Este campo es obligatorio</p>}
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="Inicio">Fecha de Inicio:</label>
                                    <div className="control">
                                        <input
                                            id="Inicio"
                                            type="datetime-local"
                                            className={`input ${errors.inicio ? 'is-danger' : ''}`}
                                            {...register('Inicio', { required: true })}
                                        />
                                    </div>
                                    {errors.inicio && <p className="help is-danger">Este campo es obligatorio</p>}
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="Fin">Fecha de Fin:</label>
                                    <div className="control">
                                        <input
                                            id="Fin"
                                            type="datetime-local"
                                            className={`input ${errors.fin ? 'is-danger' : ''}`}
                                            {...register('Fin', { required: true })}
                                        />
                                    </div>
                                    {errors.fin && <p className="help is-danger">Este campo es obligatorio</p>}
                                </div>
                                <div className="field is-grouped">
                                    <div className="control">
                                        <button
                                            className={`button is-link ${isLoading ? 'is-loading' : ''}`}
                                            type="submit"
                                        >
                                            Guardar Ticket
                                        </button>
                                    </div>
                                    {isLoading && <p className="help is-info">Guardando ticket...</p>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
