import 'bulma/css/bulma.min.css';
import { useState, useEffect } from 'react';
import { showError, showConfirmFormTarea, showErrorFormTarea } from '../helpers/swaHelper.js';
import { useForm } from 'react-hook-form';
import { createTareaRealizada, getTareasAsignadas } from '../services/tareaRealizada.service.js';
import { useParams } from 'react-router-dom';
import '../styles/FormTareaRealizada.css';
import Navbar from '../components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faFile, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function FormTareaRealizada() {
    const { id: tareaId } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const rutUsuario = user?.rut;

    console.log("Tarea ID desde useParams:", tareaId);
    console.log("Usuario desde localStorage:", user);
    console.log("RUT del Usuario:", rutUsuario);

    const [archivo, setArchivo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [estado, setEstado] = useState('incompleta');
    const [nombreTarea, setNombreTarea] = useState('');
    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    useEffect(() => {
        const fetchTarea = async () => {
            try {
                const tareas = await getTareasAsignadas(rutUsuario);
                console.log("Tareas obtenidas:", tareas);
                if (tareas && tareas.length > 0) {
                    const tarea = tareas.find(t => t && t.idTarea && t.idTarea === tareaId);
                    if (tarea) {
                        setNombreTarea(tarea.nombreTarea);
                    } else {
                        setNombreTarea('Error al obtener la tarea');
                        console.error('Tarea no encontrada con idTarea:', tareaId);
                    }
                } else {
                    setNombreTarea('No hay tareas asignadas para este usuario');
                    console.error('No se encontraron tareas asignadas para rutUsuario:', rutUsuario);
                }
            } catch (error) {
                console.error('Error al obtener la tarea:', error);
                setNombreTarea('Error al obtener la tarea');
            }
        };
        if (rutUsuario && tareaId) {
            fetchTarea();
        } else {
            console.error('rutUsuario o tareaId no están definidos:', { rutUsuario, tareaId });
            setNombreTarea('Información de usuario o tarea no disponible');
        }
    }, [tareaId, rutUsuario]);

    const onSubmit = async (data) => {
        try {
            console.log("Datos del formulario:", data);
            console.log("Archivo adjunto:", archivo);
            setIsLoading(true);
            const formData = new FormData();
            formData.append("TareaID", tareaId); 
            formData.append("comentario", data.comentario);
            formData.append("estado", data.estado);
            if (archivo) {
                formData.append("archivoAdjunto", archivo, archivo.name);
            }

            console.log("Datos enviados a createTareaRealizada:", {
                TareaID: tareaId,
                comentario: data.comentario,
                estado: data.estado,
                archivoAdjunto: archivo
            });

            const response = await createTareaRealizada(formData, rutUsuario);
            console.log("Respuesta de createTareaRealizada:", response);
            if (response.status === 201) {
                await showConfirmFormTarea();
                setArchivo(null);
                reset();
            } else {
                await showErrorFormTarea(response.data.message);
            }
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
            await showErrorFormTarea(error.message || "Error al enviar la respuesta");
        } finally {
            setIsLoading(false);
        }
    };

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0]);
    };

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

    return (
        <>
            <div className="container">
                <Navbar />
                <div className="box">
                    <h2 className="title">{nombreTarea}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="field">
                            <label className="label" htmlFor="comentario">Comentario:</label>
                            <div className="control">
                                <textarea
                                    id="comentario"
                                    placeholder="Escribe tu comentario..."
                                    className={`textarea ${errors.comentario ? 'is-danger' : ''}`}
                                    {...register('comentario', { required: true })}
                                />
                            </div>
                            {errors.comentario && <p className="help is-danger">Este campo es obligatorio</p>}
                        </div>
                        <div className="field margin-bottom-30">
                            <label className="label" htmlFor="estado">Estado:</label>
                            <div className="control select">
                                <select
                                    id="estado"
                                    {...register('estado', { required: true })}
                                    onChange={(e) => setEstado(e.target.value)}
                                >
                                    <option value="incompleta">Incompleta</option>
                                    <option value="completa">Completa</option>
                                    <option value="no realizada">No realizada</option>
                                </select>
                            </div>
                            {errors.estado && <p className="help is-danger">Este campo es obligatorio</p>}
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
                                    <FontAwesomeIcon icon={faArrowRight} className="icon" />
                                    Enviar Respuesta
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
