import 'bulma/css/bulma.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError , showConfirmFormTarea , CreateQuestion , VolverQuestion } from '../helpers/swaHelper.js';
import { useForm } from 'react-hook-form'; 
import { createTarea } from '../services/tarea.service.js';
import Navbar from '../components/navbar.jsx';

export default function FormSupervisor() {
    const navigate = useNavigate(); 

    const [archivo, setArchivo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const isConfirmed = await CreateQuestion();
        
        if (!isConfirmed) {
            return;
        }
            setIsLoading(true);
            const formData = new FormData();
            formData.append("nombreTarea", data.nombreTarea);
            formData.append("descripcionTarea", data.descripcionTarea);
            formData.append("tipoTarea", data.tipoTarea);
            formData.append("archivo", archivo);


            const response = await createTarea(formData);

            if (response.status === 201) {
                await showConfirmFormTarea();
                setArchivo(null);
                reset();
            } else if (response.status === 400) {
                await showError(response.data[0].response.data.message);
            } else if (response.status === 500) {
                await showError(response.data[0].response.data.message);
            }

        } catch (error) {
            console.log("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0]);
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

    const containerStyle = {
        display: 'flex',
        marginTop: '64px',
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
                    <h2 className="title is-4">Formulario para crear tarea</h2>
                    <p className="subtitle is-6">Ingresa los detalles de tu nueva tarea</p>
                    <div className="columns is-centered">
                        <div className="column is-two-thirds">
                            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                                <div className="field">
                                    <label className="label" htmlFor="nombreTarea">Nombre de la tarea:</label>
                                    <div className="control">
                                        <input
                                            id="nombreTarea"
                                            type="text"
                                            placeholder="Ej. Diseñar logotipo"
                                            className={`input ${errors.nombreTarea ? 'is-danger' : ''}`}
                                            {...register('nombreTarea', { 
                                                required: "Este campo es obligatorio",
                                                pattern: {
                                                    value: /^[A-Za-z0-9\s]+$/i,
                                                    message: "Solo se permiten letras, números y espacios"
                                                }
                                            })}
                                        />
                                    </div>
                                    {errors.nombreTarea && <p className="help is-danger">{errors.nombreTarea.message}</p>}
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="tipoTarea">Tipo de tarea:</label>
                                    <div className="control">
                                        <div className={`select ${errors.tipoTarea ? 'is-danger' : ''}`}>
                                            <select
                                                id="tipoTarea"
                                                {...register('tipoTarea', { required: "Este campo es obligatorio" })}
                                            >
                                                <option value="">Selecciona un tipo</option>
                                                <option value="simple">Simple</option>
                                                <option value="extensa">Extensa</option>
                                            </select>
                                        </div>
                                    </div>
                                    {errors.tipoTarea && <p className="help is-danger">{errors.tipoTarea.message}</p>}
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="descripcionTarea">Descripción de la Tarea:</label>
                                    <div className="control">
                                        <textarea
                                            id="descripcionTarea"
                                            placeholder="Describe la tarea..."
                                            className={`textarea ${errors.descripcionTarea ? 'is-danger' : ''}`}
                                            {...register('descripcionTarea', {
                                                required: "Este campo es obligatorio",
                                                validate: value => {
                                                    const wordCount = value.split(/\s+/).length;
                                                    return wordCount <= 500 || "No puede exceder 500 palabras";
                                                }
                                            })}
                                        />
                                    </div>
                                    {errors.descripcionTarea && <p className="help is-danger">{errors.descripcionTarea.message}</p>}
                                </div>
                                <div className="field">
                                    <label className="label" htmlFor="archivoAdjunto">Archivo Adjunto:</label>
                                    <div className="control">
                                        <input
                                            id="archivoAdjunto"
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
                                            Guardar Tarea
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
    
}