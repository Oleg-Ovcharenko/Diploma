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
            <div className="app">
                <Header />
                <main className="app-main">
                    <SideBar dispatch={dispatch} />
                    <MainLayout dispatch={dispatch} />
                </main>
            </div>
        )
    }
}

export default App;
