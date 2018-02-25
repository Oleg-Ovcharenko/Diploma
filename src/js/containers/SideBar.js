import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Controls from '../components/sideBar/Controls';

class SideBar extends Component {
    render() {
        const {
            networkPanelWidth,
            networkPanelHeight,
            dispatch,
        } = this.props;

        return (
            <section className="menu">
                <Controls
                    dispatch={dispatch}
                    networkPanelWidth={networkPanelWidth}
                    networkPanelHeight={networkPanelHeight}
                />
            </section>
        )
    }
}

SideBar.propTypes = {
    networkPanelWidth: PropTypes.number,
    networkPanelHeight: PropTypes.number,
};

function mapStateToProps(state) {
    return {
        networkPanelWidth: state.ui.networkPanel.width,
        networkPanelHeight: state.ui.networkPanel.height,
    };
}

export default connect(mapStateToProps)(SideBar);
