// frontend/src/components/GenerarPDF.jsx
import React from 'react';
import { generarPDF } from '../services/pdf.service';
import '../styles/PDF.css';  // Importa los estilos

const GenerarPDF = () => {
  const handleGeneratePDF = async () => {
    try {
      const response = await generarPDF({ data: 'Tu contenido aquí' });
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'informe_empleados.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error('Error generating PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
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
