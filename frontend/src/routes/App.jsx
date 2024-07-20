import React from 'react';
import navbar from '../components/navbar.jsx';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import GenerarPDF from '../components/GenerarPDF';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/generarpdf" component={GenerarPDF} />
          {/* Otras rutas pueden ir aquí */}
        </Switch>
      </div>
    </Router>
  );
};

export default App;