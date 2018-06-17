// LIBRARIES
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
// COMPONENTS
import CardMenu from './CardMenu';

class NodeSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <CardMenu
                name="Nodes settings"
            >
                <span>Need to select algorithm</span>
            </CardMenu>
        );
    }
}

NodeSettings.propTypes = {
    networkPanelWidth: PropTypes.number,
    networkPanelHeight: PropTypes.number,
    dispatch: PropTypes.func,
};

export default NodeSettings;
