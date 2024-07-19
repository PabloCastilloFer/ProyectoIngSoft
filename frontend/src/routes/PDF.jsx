import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GenerarPDF from '../components/GenerarPDF';

function PDF() {
    return (
        <Router>
            <Routes>
                <Route path="/generar-pdf" element={<GenerarPDF />} />
                {/* Otras rutas */}
            </Routes>
        </Router>
    );
}

export default PDF;