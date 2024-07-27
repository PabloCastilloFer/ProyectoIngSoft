import 'bulma/css/bulma.min.css';
import { useState, useEffect } from 'react';
import { showError, showConfirmFormTarea, showErrorFormTarea } from '../helpers/swaHelper.js';
import { useForm } from 'react-hook-form';
import { createTareaRealizada, getTareasAsignadas } from '../services/tareaRealizada.service.js';
import { useParams } from 'react-router-dom';
import '../styles/FormTareaRealizada.css';
import Navbar from '../components/navbar';

export default function FormTareaRealizada() {

    const { id: tareaId } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const rutUsuario = user.rut;

    const [archivo, setArchivo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [estado, setEstado] = useState('incompleta');
    const [nombreTarea, setNombreTarea] = useState('');
    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    useEffect(() => {
        const fetchTarea = async () => {
            try {
                const tareas = await getTareasAsignadas(rutUsuario);
                const tarea = tareas.find(t => t.idTarea === tareaId);
                if (tarea) {
                    setNombreTarea(tarea.nombreTarea);
                } else {
                    setNombreTarea('Error al obtener la tarea');
                }
            } catch (error) {
                console.error('Error al obtener la tarea:', error);
                setNombreTarea('Error al obtener la tarea');
            }
        };
        fetchTarea();
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

            const response = await createTareaRealizada(formData, rutUsuario);
            if (response.status === 201) {
                await showConfirmFormTarea();
                setArchivo(null);
                reset();
            } else {
                await showErrorFormTarea();
            }
        } catch (error) {
            await showError(error.message || "Error al enviar la respuesta");
        } finally {
            setIsLoading(false);
        }
    };

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0]);
    };

    return (
        <>
            <div className="container">
                <Navbar />
                <div className="box">
                    <h2 className="title"> {nombreTarea}</h2>
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
