import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Node extends Component {
    render() {
        const {
            node,
            nodeRadius,
            nodeColor,
        } = this.props;

        return (
            <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={nodeRadius}
                fill={nodeColor}
                onClick={this.toggle}
                className="cursor-pointer"
                id={`nodePopover-${node.id}`}
            >
                <title>
                    {
                        `NODE ${node.id}\nx: ${node.x.toFixed(2)}\ny: ${node.y.toFixed(2)}`
                    }
                </title>
            </circle>
        );
    }
}

Node.propTypes = {
    node: PropTypes.object,
    nodeRadius: PropTypes.number,
    nodeColor: PropTypes.string,
};

export default Node;
