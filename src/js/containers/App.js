import React, { Component } from 'react';
import Header from './Header';
import SideBar from './SideBar';
import MainLayout from './MainLayout';

class App extends Component {
    render() {
        return (
            <div className="app">
                <Header />
                <main className="app-main">
                    <SideBar />
                    <MainLayout />
                </main>
            </div>
        )
    }
}

export default App;