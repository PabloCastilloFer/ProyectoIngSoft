// frontend/src/components/GenerarPDF.jsx
import React from 'react';
import { generarPDF } from '../services/pdf.service';
import '../styles/Generico.css';  // Importa los estilos
import {showPDFGeneratedSuccess, showPDFGeneratedError} from '../helpers/pdfHelper';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/navbar.jsx';

const GenerarPDF = () => {
  const handleGeneratePDF = async () => {
    const filename = `${uuidv4()}.pdf`;  // Generar un nombre aleatorio para el archivo

    try {
      const response = await generarPDF();
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);  // Usar el nombre aleatorio generado
        document.body.appendChild(link);
        link.click();
        link.remove();
        await showPDFGeneratedSuccess();
      } else {
        console.error('Error generating PDF:', response.statusText);
        await showPDFGeneratedError();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      await showPDFGeneratedError();
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:'250px',
};

const BoxStyle = {
    alignItems: 'center',
    paddingTop: '64px', // Ajustar para la altura de la navbar
    width: '7000px',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
};

  return (
    <div style={containerStyle}>
            <Navbar />
            <div style={BoxStyle}>
      <div className="pdf-section">
        <h2>INFORMES EMPLEADOS</h2>
        <div className="add-comment">
          <button onClick={handleGeneratePDF}>Descargar PDF</button>
        </div>
                </div>
            </div>
      </div>
  );
};
export default GenerarPDF;