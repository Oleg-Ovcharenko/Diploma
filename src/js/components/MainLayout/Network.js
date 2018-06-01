// LIBRARIES
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// SERVICE
import CanvasService from '../../services/CanvasService';
import CalculationService from '../../services/CalculationService';
// ACTIONS
import { addNetworkWindowSize, generateLines, buildAlgorithmChangeStatus } from '../../actions';
// CONSTANTS
import { NODE_RADIUS, ALGORITHM_OPTICS, ALGORITHM_AODV } from '../../constants';
// ALGORITHMS
import Optics from '../../algorithms/Optics';
import Aodv from '../../algorithms/Aodv';

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
        this.canvasRef.addEventListener('mousemove', this.showNodeTooltip);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.generateNodes && (nextProps.generateNodes !== this.props.generateNodes)) {
            this.setCanvasSize();
        }

        if (nextProps.buildAlgorithm && (nextProps.buildAlgorithm !== this.props.buildAlgorithm)) {
            this.buildAlgorithm();
        }

        if (nextProps.nodes.length !== 0) {
            this.renderNetwork(nextProps);
        }
    }

    componentWillUnmount() {
        this.canvasRef.removeEventListener('mousemove', this.showNodeTooltip);
    }

    setCanvasSize = () => {
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

    // Получить точки которые входят в радиус действия определенной точки
    getNodesInNode(nodes, mainNode) {
        const nodesInRadius = [];

        for (let i = 0; i < nodes.length; i += 1) {
            const nearNodes = [];
            for (let j = 0; j < nodes.length; j += 1) {
                if (nodes[i].id !== nodes[j].id
                    && CalculationService.checkNodeInRadius(nodes[i].x, nodes[i].y, nodes[i].params.radius / 2, nodes[j].x, nodes[j].y)) {
                    nearNodes.push({
                        id: nodes[j].id,
                        x: nodes[j].x,
                        y: nodes[j].y,
                    });
                }
            }

            if (CalculationService.checkNodeInRadius(nodes[i].x, nodes[i].y, nodes[i].params.radius / 2, mainNode.x, mainNode.y)) {
                nearNodes.push({
                    id: mainNode.id,
                    x: mainNode.x,
                    y: mainNode.y,
                });
            }

            nodesInRadius.push({
                id: nodes[i].id,
                x: nodes[i].x,
                y: nodes[i].y,
                nodesInRadius: nearNodes,
            });
        }

        return nodesInRadius;
    }

    getNodesInMainNode(nodes, mainNode) {
        const nearNodes = [];

        for (let i = 0; i < nodes.length; i += 1) {
            if (CalculationService.checkNodeInRadius(mainNode.x, mainNode.y, mainNode.params.radius / 2, nodes[i].x, nodes[i].y)) {
                nearNodes.push({
                    id: nodes[i].id,
                    x: nodes[i].x,
                    y: nodes[i].y,
                });
            }
        }

        return {
            id: mainNode.id,
            x: mainNode.x,
            y: mainNode.y,
            nodesInRadius: nearNodes,
        };
    }

    // BUILD ALGORITHMS
    buildAlgorithm = () => {
        let linesWithNodes = null;
        const { selectedAlgorithm, nodes, mainNode } = this.props;
        const nodesWithNearNodes = this.getNodesInNode(nodes, mainNode);
        const mainNodeWithNearNodes = this.getNodesInMainNode(nodes, mainNode);

        // MODELING OPTICS ALGORITHM
        if (selectedAlgorithm === ALGORITHM_OPTICS) {
            linesWithNodes = Optics.makeOptics(nodesWithNearNodes);
        }

        // MODELING AODV ALGORITHM
        if (selectedAlgorithm === ALGORITHM_AODV) {
            linesWithNodes = Aodv.makeAodv(nodesWithNearNodes, mainNodeWithNearNodes);
        }

        this.props.dispatch(generateLines(linesWithNodes));
        this.props.dispatch(buildAlgorithmChangeStatus(false));
    }

    reRenderForTooltip = (tooltip) => {
        this.renderNetwork(this.props, tooltip);
    }

    // TOOLTIP
    showNodeTooltip = (e) => {
        const canvas = this.canvasRef;
        const {
            nodes,
            mainNode,
            scale,
        } = this.props;

        const {
            top,
            left,
        } = canvas.getBoundingClientRect();

        const mouseX = parseInt(e.clientX - left, 10);
        const mouseY = parseInt(e.clientY - top, 10);
        const nodesWithMainNode = nodes.concat([mainNode]);

        let tooltip = false;

        for (let i = 0; i < nodesWithMainNode.length; i += 1) {
            if (CalculationService.checkNodeInRadius(nodesWithMainNode[i].x, nodesWithMainNode[i].y, NODE_RADIUS / 2, mouseX, mouseY)) {
                tooltip = {
                    id: nodesWithMainNode[i].id,
                    x: nodesWithMainNode[i].x,
                    y: nodesWithMainNode[i].y,
                    radius: nodesWithMainNode[i].params.radius,
                    text: [
                        `id: ${nodesWithMainNode[i].id}`,
                        `x: ${Math.floor(nodesWithMainNode[i].x / scale, 2)} м`,
                        `y: ${Math.floor(nodesWithMainNode[i].y / scale, 2)} м`,
                        `radius: ${Math.floor(nodesWithMainNode[i].params.radius)} px`,
                        `radius: ${Math.floor(nodesWithMainNode[i].params.radius / scale, 2)} м`,
                    ],
                };
                break;
            }
        }

        this.reRenderForTooltip(tooltip);
    }

    // renders
    renderNetwork(nextProps, tooltip = false) {
        const {
            nodes,
            mainNode,
            lines,
            showRange,
            showGrid,
            scale,
        } = nextProps;

        const {
            layoutWidth,
            layoutHeight,
        } = this.state;

        const ctx = this.canvasRef.getContext('2d');
        const canvas = new CanvasService(ctx, layoutWidth, layoutHeight);

        const nodesWithMainNode = nodes.concat([mainNode]);

        // Clear canvas
        canvas.clearCanvas();
        // Render radius
        if (showRange) canvas.renderNodesRadius(nodesWithMainNode);
        // Show grid
        if (showGrid) canvas.renderGrid(scale);
        // All nodes
        canvas.renderNodes(nodes);
        // Main node
        canvas.renderMainNode(mainNode);
        // Lines
        canvas.renderLines(lines);
        // Tooltips
        canvas.renderTooltipAndNodeRadius(tooltip);
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
    nodes: PropTypes.array,
    mainNode: PropTypes.object,
    selectedAlgorithm: PropTypes.any,
    generateNodes: PropTypes.bool,
    buildAlgorithm: PropTypes.bool,
    scale: PropTypes.number,
};

export default Network;

