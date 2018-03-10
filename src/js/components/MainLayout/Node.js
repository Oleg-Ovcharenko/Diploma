import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    NODE_RADIUS,
    NODE_COLOR,
} from '../../constants';

class Node extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            node,
        } = this.props;

        return (
            <circle 
                cx={`${node.x}%`} 
                cy={`${node.y}%`} 
                r={NODE_RADIUS} 
                fill={NODE_COLOR}
                onClick={this.toggle}
                className="cursor-pointer"
                id={`nodePopover-${node.id}`}
            >
                <title>
                {
                    `NODE #${node.id}\nx: ${node.x.toFixed(2)}\ny: ${node.y.toFixed(2)}`
                }</title>
            </circle>
        );
    }
}

Node.propTypes = {
    dispatch: PropTypes.func,
    node: PropTypes.object,
};

export default Node;