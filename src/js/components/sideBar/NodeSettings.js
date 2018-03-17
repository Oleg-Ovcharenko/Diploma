import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
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
                name="Node settings"
            >
                <span>Here will be node setting</span>
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
