// LIBRARIES
import React from 'react';
import PropTypes from 'prop-types';
import Favicon from 'react-favicon';
// COMPONENTS
import Header from './Header';
import SideBar from './SideBar';
import MainLayout from './MainLayout';
// ICON
import favicon from '../../img/favicon.png';

const App = ({ dispatch }) => (
    <div className="app d-flex flex-column vh-height-100">
        <Favicon url={favicon} />
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
