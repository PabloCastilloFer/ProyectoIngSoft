import 'tailwindcss/tailwind.css';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { generarPDF, obtenerDatosPDF } from '../helpers/api';
import { mostrarAlertaExito, mostrarAlertaError } from '../helpers/alerts';

const GenerarPDF = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const datosObtenidos = await obtenerDatosPDF();
                setDatos(datosObtenidos);
                setCargando(false);
            } catch (error) {
                mostrarAlertaError('Error cargando los datos');
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    const onSubmit = async (data) => {
        try {
            const resultado = await generarPDF(data);
            if (resultado.success) {
                mostrarAlertaExito('El PDF ha sido generado y descargado exitosamente.');
                reset();
            } else {
                mostrarAlertaError('Hubo un error generando el PDF.');
            }
        } catch (error) {
            mostrarAlertaError('Hubo un error generando el PDF.');
        }
    };

    if (cargando) {
        return <p>Cargando datos...</p>;
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Generar PDF</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="campo1">
                        Campo 1:
                    </label>
                    <input
                        id="campo1"
                        type="text"
                        placeholder="Campo 1"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register('campo1', { required: true })}
                    />
                    {errors.campo1 && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="campo2">
                        Campo 2:
                    </label>
                    <input
                        id="campo2"
                        type="text"
                        placeholder="Campo 2"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register('campo2', { required: true })}
                    />
                    {errors.campo2 && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Generar PDF
                </button>
            </form>
        </div>
    );
};

export default GenerarPDF;
