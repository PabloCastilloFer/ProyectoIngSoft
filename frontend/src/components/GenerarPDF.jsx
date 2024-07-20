// frontend/src/components/GenerarPDF.jsx
import React from 'react';
import { generarPDF } from '../services/pdf.service';
import '../styles/PDF.css';  // Importa los estilos
import {showPDFGeneratedSuccess, showPDFGeneratedError} from '../helpers/pdfHelper';
import { v4 as uuidv4 } from 'uuid';

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

  return (
    <div className="pdf-section">
      <h2>INFORMES EMPLEADOS</h2>
      <div className="add-comment">
        <button onClick={handleGeneratePDF}>Descargar PDF</button>
      </div>
    </div>
  );
};

export default GenerarPDF;