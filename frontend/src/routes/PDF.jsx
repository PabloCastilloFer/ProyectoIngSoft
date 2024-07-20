// frontend/src/routes/GenerarPDF.jsx
import React, { useState, useEffect } from 'react';
import { generarPDF } from '../services/pdf.service';

const GenerarPDF = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllTareas();
      setComments(data);
    };
    fetchData();
  }, []);

  const handleGeneratePDF = async () => {
    try {
      const response = await generarPDF({ comentarios: comments });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'comentarios.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="pdf-section">
      <h2>Generar PDF</h2>
      <div className="comments-list">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            {comment.text} {/* Asegúrate de que el campo 'text' exista en los comentarios */}
          </div>
        ))}
      </div>
      <div className="add-comment">
        <button onClick={handleGeneratePDF}>Descargar PDF</button>
      </div>
    </div>
  );
};

export default GenerarPDF;
