import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addNetworkWindowSize, generateLines } from '../../actions';
import eventEmmiter from '../../utils/eventEmmiter';
import CanvasService from '../../services/CanvasService';

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
        if (!this.props.nodes[0] || nextProps.nodes[0].x !== this.props.nodes[0].x) { // TODO
            setTimeout(() => {
                this.renderNetwork(nextProps);
            }, 0);
        }

        if (this.props.startAlgorithm !== nextProps.startAlgorithm) { // TODO
            this.opticsAlgorithm(nextProps.nodes);
        }

        if (this.props.lines.length === 0 && nextProps.lines.length) { // TODO
            setTimeout(() => {
                this.renderNetwork(nextProps);
            }, 0);
        }
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
    /* growNode = (node) => {
        const canvas = this.canvasRef;
        const ctx = canvas.getContext('2d');

        let i = 0;
        function animate() {
            ctx.save();
            ctx.clearRect(0, 0, ctx.width, ctx.height);

            if (i > node.params.radius) {
                i = 1;
            }

            if (i > 40) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, i / 2, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'rgba(41,118,196,.2)';
                ctx.fill();
            }
            i += 1;
            ctx.restore();
            setTimeout(animate, 10);
        }

        animate();
    } */


    // ALGORITHM ----------------------------

    getCircleNode(x0, y0, r, x1, y1) {
        return Math.sqrt(((x0 - x1) * (x0 - x1)) + ((y0 - y1) * (y0 - y1))) <= r;
    }

    
    smallPerimeter() {

    }


    opticsAlgorithm = (nodes) => {
        const lines = [];
        for (let i = 0; i < nodes.length; i += 1) {
            let shortest = null;
            for (let j = 0; j < nodes.length; j += 1) {
                if (nodes[i].id === nodes[j].id) continue; // same id

                if (this.getCircleNode(nodes[j].x, nodes[j].y, nodes[j].params.radius, nodes[i].x, nodes[i].y)) {

                    this.smallPerimeter();

                    shortest = {
                        x1: nodes[j].x,
                        y1: nodes[j].y,
                        x2: nodes[i].x,
                        y2: nodes[i].y,
                    };
                }
            }

            if (shortest) {
                lines.push(shortest);
            }
        }

        this.props.dispatch(generateLines(lines));
    }

    // --------------------------------------

    // renders

    renderNetwork(nextProps) {
        const {
            nodes,
            mainNode,
            lines,
        } = nextProps;

        const {
            layoutWidth,
            layoutHeight,
        } = this.state;

        const canvas = this.canvasRef;
        const ctx = canvas.getContext('2d');

        CanvasService.clearCanvas(ctx, layoutWidth, layoutHeight);
        // all nodes
        CanvasService.renderNodes(ctx, nodes);
        // main node
        CanvasService.renderMainNode(ctx, mainNode);
        // lines
        CanvasService.renderLines(ctx, lines);
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
    startAlgorithm: PropTypes.bool,
    nodes: PropTypes.array,
    lines: PropTypes.array,
};

export default Network;

