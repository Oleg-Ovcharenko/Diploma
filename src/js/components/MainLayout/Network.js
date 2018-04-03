import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addNetworkWindowSize } from '../../actions';
import eventEmmiter from '../../utils/eventEmmiter';
import {
    NODE_RADIUS,
    NODE_COLOR,
    MAIN_NODE_COLOR,
    MAIN_NODE_RADIUS,
} from '../../constants';
import Animations from '../../services/Animations';

class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layoutWidth: 0,
            layoutHeight: 0,
        };
    }

    // life

    componentDidMount() {
        eventEmmiter.addListener('generateNodes', this.setSvgSizes);
    }

    componentWillReceiveProps(nextProps) {
        setTimeout(() => {
            this.renderNetwork(nextProps);
        }, 0);
    }

    componentWillUnmount() {
        eventEmmiter.removeEventListener('generateNodes');
    }

    setSvgSizes = () => {
        const {
            width,
            height,
        } = this.bodyRef.getBoundingClientRect();

        this.props.dispatch(addNetworkWindowSize(width, height));

        this.setState({
            layoutWidth: width,
            layoutHeight: height,
        });
    }

    // refs

    getNetworkBodyRef = (ref) => {
        this.bodyRef = ref;
    }

    getNetworkCanvas = (ref) => {
        this.canvasRef = ref;
    }

    // renders

    renderNetwork(nextProps) {
        const {
            nodes,
            mainNode,
        } = nextProps;

        const {
            layoutWidth,
            layoutHeight,
        } = this.state;

        const canvas = this.canvasRef;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, layoutWidth, layoutHeight);
        // all nodes
        nodes.forEach((node) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, NODE_RADIUS / 2, 2 * Math.PI, false);
            ctx.fillStyle = NODE_COLOR;
            ctx.fill();
        });
        // main node
        ctx.beginPath();
        ctx.arc(mainNode.x, mainNode.y, MAIN_NODE_RADIUS / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = MAIN_NODE_COLOR;
        ctx.fill();
    }

    render() {
        const {
            layoutWidth,
            layoutHeight,
        } = this.state;

        return (
            <div className="card network-layout rounded-0 flex-grow-1">
                <div className="card-body p-0 w-100 position-relative overflow-a" ref={this.getNetworkBodyRef}>
                    <canvas
                        className="position-absolute"
                        ref={this.getNetworkCanvas}
                        width={layoutWidth}
                        height={layoutHeight}
                    >
                    </canvas>
                </div>
            </div>
        );
    }
}

Network.propTypes = {
    dispatch: PropTypes.func,
};

export default Network;

