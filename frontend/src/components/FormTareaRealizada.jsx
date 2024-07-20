import 'bulma/css/bulma.min.css';
import { useState } from 'react';
import { showError, showConfirmFormTareaRealizada, showErrorFormTareaRealizada } from '../helpers/swaHelper.js';
import { useForm } from 'react-hook-form';
import { createTareaRealizada } from '../services/tareaRealizada.service.js';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import { useParams } from 'react-router-dom';
import '../styles/FormTareaRealizada.css'; // Importa el archivo CSS

export default function FormTareaRealizada() {

    const { id: tareaId } = useParams(); // Obtiene el ID de la tarea desde los parámetros de la URL
    const rutUsuario = '20829012-6'; // Ajusta esto según tu contexto
   

    const [archivo, setArchivo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [estado, setEstado] = useState('incompleta');
    const { register, formState: { errors }, handleSubmit, reset } = useForm();

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

            const response = await createTareaRealizada(formData, rutUsuario);
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
        <div className="container">
            <div className="box">
                <h2 className="title">Responder a la Tarea</h2>
                <div className="columns is-centered">
                    <div className="column is-two-thirds">
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
                            <div className="field">
                                <label className="label" htmlFor="estado">Estado:</label>
                                <div className="control">
                                    <div className={`select ${errors.estado ? 'is-danger' : ''}`}>
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
            </div>
        </div>
    );
}
