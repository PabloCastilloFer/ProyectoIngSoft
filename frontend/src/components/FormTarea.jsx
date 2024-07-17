import 'tailwindcss/tailwind.css';
import { useEffect, useState } from 'react';
import { showError } from '../helpers/swaHelper.js';
import { useForm } from 'react-hook-form'; 
import { createTarea } from '../services/tarea.service.js';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

export default function FormSupervisor() {
    const jwt = useAuth(); // Obtiene el token JWT del contexto de autenticación

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
                await showConfirmForm();
                reset();
                setArchivo(null);
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

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Formulario de tarea: </h2>
            <p className="text-gray-600 mb-6">Ingresa los detalles de tu nueva tarea.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreTarea">
                        Nombre de Tarea: 
                    </label>
                    <input
                        id="nombreTarea"
                        type="text"
                        placeholder="Ej. Diseñar logotipo"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register('nombreTarea', { required: true })}
                    />
                    {errors.nombreTarea && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipoTarea">
                        Tipo de Tarea:
                    </label>
                    <select
                        id="tipoTarea"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register('tipoTarea', { required: true })}
                        onChange={(e) => setTipoTarea(e.target.value)}
                    >
                        <option  value="simple">simple</option>
                        <option value="extensa">extensa</option>
                    </select>
                    {errors.tipoTarea && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcionTarea">
                        Descripción de Tarea: 
                    </label>
                    <textarea
                        id="descripcionTarea"
                        placeholder="Describe la tarea..."
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register('descripcionTarea', { required: true })}
                    />
                    {errors.descripcionTarea && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="archivoAdjunto">
                        Archivo Adjunto: 
                    </label>
                    <input
                        id="archivoAdjunto"
                        type="file"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={handleArchivoChange}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Guardar Tarea
                    </button>
                </div>
            </form>
        </div>
    );
}
