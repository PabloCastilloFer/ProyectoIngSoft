import 'bulma/css/bulma.min.css';
import { useEffect, useState } from 'react';
import { showError , showConfirmFormTarea } from '../helpers/swaHelper.js';
import { useForm } from 'react-hook-form'; 
import { createTarea } from '../services/tarea.service.js';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import Navbar from '../components/navbar.jsx';

export default function FormSupervisor() {
    const jwt = useAuth();

    const userStorage = localStorage.getItem('user');
    const userDat = JSON.parse(userStorage); // Corregido

    const [archivo, setArchivo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [nombreTarea, setNombreTarea] = useState('');
    const [descripcionTarea, setDescripcionTarea] = useState('');
    const [tipoTarea, setTipoTarea] = useState('');
    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("nombreTarea", data.nombreTarea);
            formData.append("descripcionTarea", data.descripcionTarea);
            formData.append("tipoTarea", data.tipoTarea);
            formData.append("archivo", archivo);
            console.log(formData)

            const response = await createTarea(formData); // Pasa el token JWT a la función createTarea
            console.log(response)
            if (response.status === 201) {
                await showConfirmFormTarea();
                setArchivo(null);
                reset(); // Resetea los campos del formulario
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

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0]);
    };

    const handleGuardarTarea = () => {
        // Enviar formulario con handleSubmit
        handleSubmit(onSubmit)();
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:'250px', // Ajustar el margen según el estado de la barra lateral
    };

    const BoxStyle = {
        alignItems: 'center',
        paddingTop: '64px', // Ajustar para la altura de la navbar
        width: '700px',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
    };


    return (
        <div style={containerStyle}>
            <Navbar/>
            <div style={BoxStyle}>
                <div>
                    <h2 className="title is-4">Formulario para crear tarea</h2>
                    <p className="subtitle is-6">Ingresa los detalles de tu nueva tarea</p>
                    <div className="columns is-centered">
                        <div className="column is-two-thirds">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="field">
                                    <label className="label" htmlFor="nombreTarea">Nombre de la tarea:</label>
                                    <div className="control">
                                        <input
                                            id="nombreTarea"
                                            type="text"
                                            placeholder="Ej. Diseñar logotipo"
                                            className={`input ${errors.nombreTarea ? 'is-danger' : ''}`}
                                            {...register('nombreTarea', { required: true })}
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
                                            placeholder="Describe la tarea..."
                                            className={`textarea ${errors.descripcionTarea ? 'is-danger' : ''}`}
                                            {...register('descripcionTarea', { required: true })}
                                        />
                                    </div>
                                    {errors.descripcionTarea && <p className="help is-danger">Este campo es obligatorio</p>}
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