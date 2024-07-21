import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from './navbar.jsx';
import { updateTicket } from '../services/ticket.service.js';
import { useLocation } from 'react-router-dom';
import { UpdatedTicket } from '../helpers/swaHelper.js'; // Asegúrate de importar UpdateQuestion

const EditarTicket = ({ initialData }) => {
    const location = useLocation();
    const { ticket } = location.state;
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: initialData
    });
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        // Solicita confirmación antes de continuar
        const isConfirmed = await UpdatedTicket();
        
        if (!isConfirmed) {
            // Si el usuario cancela, no hace nada
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('TareaID', data.TareaID);
        formData.append('RutAsignado', data.RutAsignado);
        formData.append('Inicio', data.Inicio);
        formData.append('Fin', data.Fin);

        try {
            const response = await updateTicket(formData, ticket.TareaID);
            if (response.status === 200) {
                window.location.reload();
            } else {
                alert('Error al actualizar la asignacion');
            }
        } catch (error) {
            alert('Ocurrió un error al actualizar la asignacion');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div style={containerStyle}>
            <Navbar />
            <div style={BoxStyle}>
                <div>
                    <h2 className="title is-4">Formulario de edición de ticket</h2>
                    <p className="subtitle is-6">Ingresa las modificaciones al ticket</p>
                    <div className="columns is-centered">
                        <div className="column is-two-thirds">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="field">
                                    <label className="label" htmlFor="TareaID">ID de la Tarea:</label>
                                    <div className="control">
                                        <input 
                                            id="TareaID" 
                                            type="text" 
                                            defaultValue={ticket.TareaID} // Usar defaultValue para mostrar el valor inicial
                                            className={`input ${errors.TareaID ? 'is-danger' : ''}`}
                                            readOnly // Hace el campo de solo lectura
                                        />
                                        {errors.TareaID && <p className="help is-danger">El ID de la tarea es obligatorio</p>}
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

// Define tus estilos de contenedor y caja
const containerStyle = {
    padding: '20px'
};

const BoxStyle = {
    margin: '20px auto',
    padding: '20px',
    maxWidth: '800px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
};
