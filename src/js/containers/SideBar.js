import React, { Component } from 'react';
import Controls from '../components/sideBar/Controls';

class SideBar extends Component {
    render() {
        return (
            <section className="menu">
                <Controls />
            </section>
        )
    }
}

export default SideBar;