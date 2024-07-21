import 'bulma/css/bulma.min.css';
import { useState, useEffect } from 'react';
import { showError, showConfirmFormTareaRealizada, showErrorFormTareaRealizada } from '../helpers/swaHelper.js';
import { useForm } from 'react-hook-form';
import { createTareaRealizada, getTareasAsignadas } from '../services/tareaRealizada.service.js'; // Importa el servicio para obtener las tareas asignadas
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import { useParams } from 'react-router-dom';
import '../styles/FormTareaRealizada.css'; // Importa el archivo CSS
import Navbar from '../components/navbar'; // Importa la Navbar

export default function FormTareaRealizada() {

    const { id: tareaId } = useParams(); // Obtiene el ID de la tarea desde los parámetros de la URL
    const rutUsuario = '20829012-6'; // Ajusta esto según tu contexto

    const [archivo, setArchivo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [estado, setEstado] = useState('incompleta');
    const [nombreTarea, setNombreTarea] = useState(''); // Estado para el nombre de la tarea
    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    // Obtener la tarea por su ID cuando el componente se monta
    useEffect(() => {
        const fetchTarea = async () => {
            try {
                const tareas = await getTareasAsignadas(rutUsuario); // Pasa el token JWT
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
            console.log("Datos del formulario:", data); // Añadir este console.log
            console.log("Archivo adjunto:", archivo); // Añadir este console.log
            setIsLoading(true);
            const formData = new FormData();
            formData.append("tarea", tareaId);
            formData.append("comentario", data.comentario);
            formData.append("estado", data.estado); // Cambiado a data.estado
            if (archivo) {
                formData.append("archivoAdjunto", archivo, archivo.name); // Asegúrate de pasar el nombre del archivo
            }

            const response = await createTareaRealizada(formData, rutUsuario); // Pasa el token JWT
            if (response.status === 201) {
                await showConfirmFormTareaRealizada();
                setArchivo(null);
                reset(); // Resetea los campos del formulario
            } else {
                await showErrorFormTareaRealizada();
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
                <Navbar /> {/* Incluye la Navbar */}
                <div className="box">
                    <h2 className="title"> {nombreTarea}</h2> {/* Muestra el nombre de la tarea */}
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
