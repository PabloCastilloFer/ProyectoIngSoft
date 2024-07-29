import React from 'react';
import '../styles/App.css'; // Asegúrate de importar el archivo CSS

function App() {
  return (
    <div className="page-container">
      <img
        src="/UB.jpg"
        alt="Descripción de la imagen" // Añade un alt para accesibilidad
      />
      <h1 className="Abajo">¡Solo un commit más y terminamos el trabajo!</h1>
    </div>
  );
}

export default App;
