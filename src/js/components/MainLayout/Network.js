import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addNetworkWindowSize } from '../../actions';
import {
    NODE_RADIUS,
    NODE_COLOR,
} from '../../constants';
import eventEmmiter from '../../utils/eventEmmiter';

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

        console.log(height);

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
        } = this.props;

        const viewBox = `0 0 ${svgWidth} ${svgHeight}`;

        return (
            <div className="card network-layout b-r-0">
                <div className="card-body p-0 w-100 h-100 o-hidden" ref={this.getNetworkBodyRef}>
                    <svg viewBox={viewBox} version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <g className="lines"></g>
                        <g className="nodes">
                            {
                                nodes.map((node) => (
                                    <circle key={node.id} cx={`${node.x}%`} cy={`${node.y}%`} r={NODE_RADIUS} fill={NODE_COLOR}><title>{`NODE ${node}`}</title></circle>
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

