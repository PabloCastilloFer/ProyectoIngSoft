import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/navbar.jsx';
import { updateTicket } from '../services/ticket.service.js';
import { useLocation , useNavigate} from 'react-router-dom';
import { showError, showConfirmFormTicket, CreatedTicket, VolverQuestion, showFechaInicioError, showFechaInicioLaboralError, showFechaFinError, showFechaFinLaboralError, showRutAsignadoError, UpdatedTicket } from '../helpers/swaHelper.js';

const isValidDate = (date) => {
    const dayOfWeek = date.getUTCDay();
    const hour = date.getUTCHours();

    if (dayOfWeek < 1 || dayOfWeek > 5) {
        return false;
    }

    if (hour < 8 || hour > 18) {
        return false;
    }

    return true;
};

const validateForm = (data) => {
    const { TareaID, Inicio, Fin, RutAsignado } = data;

    if (!TareaID) {
        showTareaError();
        return false;
    }

    const inicio = new Date(Inicio);
    const fin = new Date(Fin);
    const now = new Date();

    if (inicio <= now) {
        showFechaInicioError();
        return false;
    }

    if (!isValidDate(inicio)) {
        showFechaInicioLaboralError();
        return false;
    }

    if (fin <= inicio) {
        showFechaFinError();
        return false;
    }

    if (!isValidDate(fin)) {
        showFechaFinLaboralError();
        return false;
    }

    if (!RutAsignado) {
        showRutAsignadoError();
        return false;
    }

    return true;
};

const EditarTicket = ({ initialData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { ticket } = location.state;
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: initialData
    });
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            const isConfirmed = await CreatedTicket();

            if (!isConfirmed) {
                return;
            }
            setIsLoading(true);
            const formData = new FormData();
            formData.append("TareaID", ticket.TareaID);
            formData.append("RutAsignado", data.RutAsignado);
            formData.append("Inicio", data.Inicio);
            formData.append("Fin", data.Fin);

            console.log("FormData contenido:", Array.from(formData.entries())); // Agrega esto para verificar el contenido de FormData

            // Convertir formData a un objeto simple para validar
            const formDataObject = Object.fromEntries(formData.entries());
            if (!validateForm(formDataObject)) {
                setIsLoading(false);
                return;
            }

            const response = await updateTicket(formData);
            if (response.status === 200) {
                await showConfirmFormTicket();
                navigate(-1);
            } else if (response.status === 400 || response.status === 500) {
                await showError(response.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            showError("Ha ocurrido un error al actualizar el ticket.");
        } finally {
            setIsLoading(false);
        }
    };


const handleVolver = async (tareaToVolver) => {
    const isConfirmed = await VolverQuestion();
    if (isConfirmed) {
        navigate(-1);
    } 
};
// Define tus estilos de contenedor y caja
const containerStyle = {
    marginTop: '64px', // Ajustar para la altura de la navbar
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:'250px', 
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
                <h2 className="title is-4">Formulario de edición de ticket</h2>
                <p className="subtitle is-6">Ingresa las modificaciones al ticket</p>
                <div className="columns is-centered">
                    <div className="column is-two-thirds">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="field">
                            <div className="field">
                                    <label className="label">Nombre del Ticket:</label>
                                        <p className="is-size-5">{ticket.nombreTarea}</p>
                                </div>
                                <div className="field">
                                    <label className="label">Descripción:</label>
                                    <div className="control">
                                        <p className="is-size-5">{ticket.descripcionTarea}</p>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="TareaID">ID de la Tarea:</label>
                                    <div className="control">
                                        <p className="is-size-5">{ticket.TareaID}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" htmlFor="RutAsignado">RUT Asignado:</label>
                                <div className="control">
                                <input 
                                    id="RutAsignado" 
                                    type="text" 
                                    placeholder={ticket.RutAsignado} 
                                    className={`input ${errors.RutAsignado ? 'is-danger' : ''}`}
                                    {...register("RutAsignado", { required: true })} 
                                    />
                                    {errors.RutAsignado && <p className="help is-danger">El RUT asignado es obligatorio</p>}
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" htmlFor="Inicio">Inicio:</label>
                                <div className="control">
                                <input 
                                    id="Inicio" 
                                    type="datetime-local" 
                                    placeholder={ticket.Inicio} 
                                    className={`input ${errors.Inicio ? 'is-danger' : ''}`}
                                    {...register("Inicio", { required: true })} 
                                    />
                                    {errors.Inicio && <p className="help is-danger">La fecha de inicio es obligatoria</p>}
                                </div>
                            </div>
                            <div className="field">
                                <label className="label" htmlFor="Fin">Fin:</label>
                                <div className="control">
                                <input 
                                    id="Fin" 
                                    type="datetime-local" 
                                    placeholder={ticket.Fin} 
                                    className={`input ${errors.Fin ? 'is-danger' : ''}`}
                                    {...register("Fin", { required: true })} 
                                    />
                                    {errors.Fin && <p className="help is-danger">La fecha de fin es obligatoria</p>}
                                </div>
                            </div>
                            <div className="field is-grouped">
                                <div className="control">
                                    <button
                                        className={`button is-link ${isLoading ? 'is-loading' : ''}`}
                                        type="submit"
                                    >
                                        Actualizar Asignacion
                                    </button>
                                </div>
                                {isLoading && <p className="help is-info">Guardando asignacion...</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default EditarTicket;

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
    
