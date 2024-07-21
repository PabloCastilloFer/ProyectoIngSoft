import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/navbar.jsx';
import { updateTarea } from '../services/tarea.service.js';
import { useLocation , useNavigate } from 'react-router-dom';
import { UpdateQuestion , VolverQuestion } from '../helpers/swaHelper.js'; // Asegúrate de importar UpdateQuestion

const EditarTarea = ({ initialData }) => {
    const navigate = useNavigate(); 
    const location = useLocation();
    const { tarea } = location.state;
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: initialData
    });
    const [isLoading, setIsLoading] = useState(false);
    const [archivo, setArchivo] = useState(null);

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0]);
    };

    const onSubmit = async (data) => {
        // Solicita confirmación antes de continuar
        const isConfirmed = await UpdateQuestion();
        
        if (!isConfirmed) {
            // Si el usuario cancela, no hace nada
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('nombreTarea', data.nombreTarea);
        formData.append('tipoTarea', data.tipoTarea);
        formData.append('descripcionTarea', data.descripcionTarea);
        if (archivo) {
            formData.append('archivo', archivo);
        }

        try {
            const response = await updateTarea(formData, tarea.idTarea);
            if (response.status === 200) {
                window.location.reload();
            } else {
                alert('Error al actualizar la tarea');
            }
        } catch (error) {
            alert('Ocurrió un error al actualizar la tarea');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVolver = async (tareaToVolver) => {
        const isConfirmed = await VolverQuestion();
        if (isConfirmed) {
            navigate(-1);
        } 
    };;

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
        marginRight:'250px', 
    };

    const BoxStyle = {
        alignItems: 'center',
        paddingTop: '64px', 
        width: '800px',
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
                    <h2 className="title is-4">Formulario de edición de tarea</h2>
                    <p className="subtitle is-6">Ingresa las modificaciones a la tarea</p>
                    <div className="columns is-centered">
                        <div className="column is-two-thirds">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="field">
                                    <label className="label" htmlFor="nombreTarea">Nombre de la tarea:</label>
                                    <div className="control">
                                        <input
                                            id="nombreTarea"
                                            type="text"
                                            placeholder={tarea.nombreTarea}
                                            className={`input ${errors.nombreTarea ? 'is-danger' : ''}`}
                                            {...register('nombreTarea', { required: false })}
                                        />
                                    </div>
                                    {errors.nombreTarea && <p className="help is-danger">Este campo es obligatorio</p>}
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="tipoTarea">Tipo de tarea:</label>
                                    <div className="control">
                                        <div className={`select ${errors.tipoTarea ? 'is-danger' : ''}`}>
                                            <select
                                                id="tipoTarea"
                                                {...register('tipoTarea', { required: true })}
                                            >
                                                <option value="">Selecciona un tipo</option>
                                                <option value="simple">Simple</option>
                                                <option value="extensa">Extensa</option>
                                            </select>
                                        </div>
                                    </div>
                                    {errors.tipoTarea && <p className="help is-danger">Este campo es obligatorio</p>}
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="descripcionTarea">Descripción de la Tarea:</label>
                                    <div className="control">
                                        <textarea
                                            id="descripcionTarea"
                                            placeholder={tarea.descripcionTarea}
                                            className={`textarea ${errors.descripcionTarea ? 'is-danger' : ''}`}
                                            {...register('descripcionTarea', { required: false })}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="archivo">Archivo Adjunto:</label>
                                    <div className="control">
                                        <input
                                            id="archivo"
                                            type="file"
                                            className="input"
                                            onChange={handleArchivoChange}
                                        />
                                    </div>
                                </div>
                                <div className="field is-grouped">
                                    <div className="control">
                                        <button
                                            className={`button is-link ${isLoading ? 'is-loading' : ''}`}
                                            type="submit"
                                        >
                                            Actualizar Tarea
                                        </button>
                                    </div>
                                    {isLoading && <p className="help is-info">Guardando tarea...</p>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarTarea;

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