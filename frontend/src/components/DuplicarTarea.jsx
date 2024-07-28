import 'bulma/css/bulma.min.css';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/navbar.jsx'; // Asegúrate de que la ruta a Navbar sea correcta
import { duplicarTarea } from '../services/tarea.service.js'; // Asegúrate de que la ruta al servicio sea correcta
import { useLocation, useNavigate } from 'react-router-dom';
import { VolverQuestion } from '../helpers/swaHelper.js';

const DuplicarTarea = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tarea } = location.state;
    const [isLoading, setIsLoading] = useState(false);
    const [archivo, setArchivo] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (tarea) {
            setValue('nombreTarea', tarea.nombreTarea);
            setValue('tipoTarea', tarea.tipoTarea);
            setValue('descripcionTarea', tarea.descripcionTarea);
        }
    }, [tarea, setValue]);

    const handleArchivoChange = (event) => {
        setArchivo(event.target.files[0]); // Guarda el archivo en el estado
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Crear FormData y agregar los campos
            const formData = new FormData();
            formData.append('nombreTarea', data.nombreTarea);
            formData.append('tipoTarea', data.tipoTarea);
            formData.append('descripcionTarea', data.descripcionTarea);
            if (archivo) {
                formData.append('archivo', archivo);
            }

            await duplicarTarea(formData, tarea.idTarea); // Pasa el formData y el idTarea
            navigate('/tareas'); // Redirige a la lista de tareas o a donde sea apropiado
        } catch (error) {
            console.error('Error duplicando tarea:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVolver = async () => {
        const isConfirmed = await VolverQuestion();
        if (isConfirmed) {
            navigate(-1);
        }
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

    if (!tarea) return <p>Cargando tarea...</p>;

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
                    <h2 className="title is-4">Formulario de duplicación de tarea</h2>
                    <p className="subtitle is-6">Ingresa las modificaciones a la tarea</p>
                    <div className="columns is-centered">
                        <div className="column is-two-thirds">
                            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                                <div className="field">
                                    <label className="label" htmlFor="nombreTarea">Nombre de la tarea:</label>
                                    <div className="control">
                                        <input
                                            id="nombreTarea"
                                            type="text"
                                            placeholder="Nombre de la tarea"
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
                                            placeholder="Descripción de la tarea"
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
                                            Duplicar Tarea
                                        </button>
                                    </div>
                                    {isLoading && <p className="help is-info">Duplicando tarea...</p>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuplicarTarea;