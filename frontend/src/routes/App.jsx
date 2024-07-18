// src/routes/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TareaAsignadaList from '../components/TareaAsignadaList';
import TareaAsignadaDetail from '../components/TareaAsignadaDetail';

const App = () => {
    const rutUsuario = 'user123'; // Reemplaza esto con el valor real del usuario

    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/tareas-asignadas">
                        <TareaAsignadaList rutUsuario={rutUsuario} />
                    </Route>
                    <Route path="/tareas-asignadas/:id">
                        <TareaAsignadaDetail rutUsuario={rutUsuario} />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
