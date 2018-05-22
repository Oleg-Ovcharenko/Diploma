// LIBRARIES
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eventEmmiter from '../../utils/eventEmmiter';
// SERVICE
import CanvasService from '../../services/CanvasService';
import CalculationService from '../../services/CalculationService';
// ACTIONS
import { addNetworkWindowSize, generateLines } from '../../actions';
// CONSTANTS
import { NODE_RADIUS, ALGHORITHM_OPTICS } from '../../constants';
// ALGORITHMS
import Optics from '../../algorithms/optics';

class Network extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layoutWidth: 0,
            layoutHeight: 0,
            nodes: [],
            showTooltip: false,
        };
    }

    // life
    componentDidMount() {
        const canvas = this.canvasRef;
        eventEmmiter.addListener('generateNodes', this.setCanvasSize);
        eventEmmiter.addListener('buildAlgorithm', this.buildAlgorthm);
        canvas.addEventListener('mousemove', this.showNodeTooltip);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.nodes.length !== 0 && nextProps.mainNode) {
            setTimeout(() => {
                this.renderNetwork(nextProps);
                this.setState({
                    nodes: nextProps.nodes,
                });
            }, 0);
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.nodes.length !== 0 && nextProps.mainNode) {
            this.renderNetwork(nextProps);
        }
    }

    componentWillUnmount() {
        const canvas = this.canvasRef;
        eventEmmiter.removeAllListeners();
        canvas.removeEventListener('mousemove', this.showNodeTooltip);
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
    getRadiusNodes(nodes, mainNode) {
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

    // BUILD ALGHORITHMS
    buildAlgorthm = () => {
        const {
            selectedAlghorithm,
        } = this.props;

        const nodesWithNearNodes = this.getRadiusNodes(this.props.nodes, this.props.mainNode);

        // МОДЕЛИРОВАНИЕ АЛГОРИТМА OPTICS
        if (selectedAlghorithm === ALGHORITHM_OPTICS) {
            const linesWithNodes = Optics.makeOpticsCluster(nodesWithNearNodes);

            if (linesWithNodes.length !== 0) {
                this.props.dispatch(generateLines(linesWithNodes));
            }
        }
    }

    // TOOLTIPS
    showNodeTooltip = (e) => {
        const canvas = this.canvasRef;
        const {
            nodes,
        } = this.state;
        const {
            top,
            left,
            showTooltip,
        } = canvas.getBoundingClientRect();

        const mouseX = parseInt(e.clientX - left, 10);
        const mouseY = parseInt(e.clientY - top, 10);

        let tooltip = false;

        for (let i = 0; i < nodes.length; i += 1) {
            if (CalculationService.checkNodeInRadius(nodes[i].x, nodes[i].y, NODE_RADIUS / 2, mouseX, mouseY)) {
                tooltip = {
                    id: nodes[i].id,
                    x: nodes[i].x,
                    y: nodes[i].y,
                    radius: nodes[i].params.radius,
                };
                break;
            }
        }

        if (tooltip !== showTooltip) {
            this.setState({
                showTooltip: tooltip,
            });
        }
    }

    // renders
    renderNetwork(nextProps) {
        const {
            nodes,
            mainNode,
            lines,
            showRange,
        } = nextProps;

        const {
            layoutWidth,
            layoutHeight,
            showTooltip,
        } = this.state;

        const canvas = this.canvasRef;
        const ctx = canvas.getContext('2d');

        // clear canvas
        CanvasService.clearCanvas(ctx, layoutWidth, layoutHeight);
        // all nodes
        CanvasService.renderNodes(ctx, nodes);
        // render radius
        if (showRange) CanvasService.renderNodesRadius(ctx, nodes);
        // main node
        CanvasService.renderMainNode(ctx, mainNode);
        // lines
        CanvasService.renderLines(ctx, lines);
        // tooltips
        CanvasService.renderTooltipAndNodeRadius(ctx, showTooltip);
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
    selectedAlghorithm: PropTypes.any,
};

export default Network;

