import React, { Component } from 'react';
import Header from './Header';
import SideBar from './SideBar';
import MainLayout from './MainLayout';

class App extends Component {
    render() {
        const {
            dispatch,
        } = this.props;

        return (
            <div className="app d-flex flex-column vh-height-100">
                <Header />
                <main className="app-main d-flex flex-grow-1">
                    <SideBar dispatch={dispatch} />
                    <MainLayout dispatch={dispatch} />
                </main>
            </div>
        )
    }
}

export default App;
