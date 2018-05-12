// LIBRARIES
import React from 'react';
import PropTypes from 'prop-types';
// COMPONENTS
import Header from './Header';
import SideBar from './SideBar';
import MainLayout from './MainLayout';

const App = ({ dispatch }) => (
    <div className="app d-flex flex-column vh-height-100">
        <Header />
        <main className="app-main d-flex flex-grow-1 min-height-500">
            <SideBar dispatch={dispatch} />
            <MainLayout dispatch={dispatch} />
        </main>
    </div>
);

App.propTypes = {
    dispatch: PropTypes.func,
};

export default App;
