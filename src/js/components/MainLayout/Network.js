import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addNetworkWindowSize } from '../../actions';
import {
    NODE_RADIUS,
    NODE_COLOR,
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

    render() {
        const {
            svgWidth,
            svgHeight,
        } = this.state;

        const {
            nodes,
        } = this.props;

        const viewBox = `0 0 ${svgWidth} ${svgHeight}`;

        return (
            <div className="card network-layout b-r-0">
                <div className="card-body p-0" ref={this.getNetworkBodyRef}>
                    <svg viewBox={viewBox} version="1.1" xmlns="http://www.w3.org/2000/svg" width={svgWidth} height={svgHeight}>
                        <g className="lines">
                            
                        </g>
                        <g className="nodes">
                            {
                                nodes.map((node) => (
                                    <circle key={node.id} cx={node.x} cy={node.y} r={NODE_RADIUS} fill={NODE_COLOR}><title>{`NODE ${node}`}</title></circle>
                                ))
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
};

export default Network;

