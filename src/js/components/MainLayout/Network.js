import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addNetworkWindowSize } from '../../actions';
import Node from './Node';
import Line from './Line';
import eventEmmiter from '../../utils/eventEmmiter';
import {
    NODE_RADIUS,
    NODE_COLOR,
    MAIN_NODE_COLOR,
    MAIN_NODE_RADIUS,
} from '../../constants';

class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            svgWidth: 0,
            svgHeight: 0,
        };
    }

    componentDidMount() {
        this.setSvgSizes();
        window.addEventListener('resize', this.reszeWindow);
        eventEmmiter.addListener('generateNodes', this.setSvgSizes);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.reszeWindow);
        eventEmmiter.removeEventListener('generateNodes');
    }

    setSvgSizes = () => {
        const {
            width,
            height,
        } = this.bodyRef.getBoundingClientRect();

        this.props.dispatch(addNetworkWindowSize(width, height));

        this.setState({
            svgWidth: width,
            svgHeight: height,
        });
    }

    getNetworkBodyRef = (ref) => {
        this.bodyRef = ref;
    }

    reszeWindow = () => {
        this.setSvgSizes();
    }

    render() {
        const {
            svgWidth,
            svgHeight,
        } = this.state;

        const {
            nodes,
            lines,
            mainNode,
        } = this.props;

        const viewBox = `0 0 ${svgWidth} ${svgHeight}`;

        return (
            <div className="card network-layout b-r-0">
                <div className="card-body p-0 w-100 h-100 o-hidden" ref={this.getNetworkBodyRef}>
                    <svg viewBox={viewBox} version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <g className="lines">
                            {
                                lines.map((line) => (
                                    <Line
                                        key={line.id}
                                        line={line}
                                    />
                                ))
                            }
                        </g>
                        <g className="nodes">
                            {
                                nodes.map((node) => (
                                    <Node
                                        key={node.id}
                                        node={node}
                                        nodeRadius={NODE_RADIUS}
                                        nodeColor={NODE_COLOR}
                                    />
                                ))
                            }
                        </g>
                        <g className="mainNode">
                            {
                                mainNode ? (
                                    <Node
                                        node={mainNode}
                                        nodeRadius={MAIN_NODE_RADIUS}
                                        nodeColor={MAIN_NODE_COLOR}
                                    />
                                ) : null
                            }
                        </g>
                    </svg>
                </div>
            </div>
        );
    }
}

Network.propTypes = {
    dispatch: PropTypes.func,
    nodes: PropTypes.array,
    lines: PropTypes.array,
    mainNode: PropTypes.object,
};

export default Network;

