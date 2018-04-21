import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addNetworkWindowSize, generateLines } from '../../actions';
import eventEmmiter from '../../utils/eventEmmiter';
import CanvasService from '../../services/CanvasService';
import { randomRange } from './../../helpers/helpersFunctions';

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
        eventEmmiter.addListener('buildAlgorithm', this.buildAlgorthm);
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

    // BASE ALGORITHM -----------------------

    // Получить точки которые входят в радиус действия определенной точки
    getRadiusNodes(nodes) {
        const nodesInRadius = [];

        for (let i = 0; i < nodes.length; i += 1) {
            const nearNodes = [];
            for (let j = 0; j < nodes.length; j += 1) {
                if (nodes[i].id !== nodes[j].id
                    && this.checkNodeInRadius(nodes[i].x, nodes[i].y, nodes[i].params.radius / 2, nodes[j].x, nodes[j].y)) {
                    nearNodes.push({
                        id: nodes[j].id,
                        x: nodes[j].x,
                        y: nodes[j].y,
                    });
                }
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

    buildAlgorthm = () => {
        this.opticsAlgorithm(this.props.nodes);
    }

    checkNodeInRadius(Xc, Yc, Rc, x, y) {
        return ((x - Xc) * (x - Xc) + (y - Yc) * (y - Yc)) < Rc * Rc;
    }

    distanceBetweenNodes(x0, x1, y0, y1) {
        return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
    }

    trianglePerimeter(x0, y0, x1, y1, x2, y2) {
        return this.distanceBetweenNodes(x0, x1, y0, y1)
                + this.distanceBetweenNodes(x0, x2, y0, y2)
                + this.distanceBetweenNodes(x1, x2, y1, y2);
    }

    // ALGORITHM ----------------------------

    // получить ребро для ближайшей точки в радиусе
    getLineForNearNode(node) {
        let minDistance = null;
        let nearNode = null;

        node.nodesInRadius.map((item) => {
            const distanceNow = this.distanceBetweenNodes(node.x, item.x, node.y, item.y);
            if (!minDistance || minDistance > distanceNow) {
                minDistance = distanceNow;
                nearNode = item;
            }
        });

        return {
            idNode: node.id,
            idNexNode: nearNode.id,
            x1: node.x,
            x2: nearNode.x,
            y1: node.y,
            y2: nearNode.y,
        };
    }

    // получить ребро по минимальному периметру
    getLineForMinimumPerimeter(node, prevLine, nodesIdsInRoutes) {
        let minPerimeter = null;
        let nearNode = null;

        node.nodesInRadius.map((item) => {
            if (item.id !== prevLine.idNode && item.id !== prevLine.idNexNode && nodesIdsInRoutes.indexOf(item.id) === -1) {
                const perimeterNow = this.trianglePerimeter(prevLine.x1, prevLine.y1, prevLine.x2, prevLine.y2, item.x, item.y);
                if (!minPerimeter || minPerimeter > perimeterNow) {
                    minPerimeter = perimeterNow;
                    nearNode = item;
                }
            }
        });

        if (nearNode) {
            return {
                idNode: node.id,
                idNexNode: nearNode.id,
                x1: node.x,
                x2: nearNode.x,
                y1: node.y,
                y2: nearNode.y,
            };
        } else {
            return false;
        }
    }

    getNodeWithLine = (nodes, line) => {
        return nodes.find((item) => {
            if (item.id === line.idNexNode) {
                return item;
            }
        });
    }

    makeOpticsCluster(nodes) {
        const lines = [];
        const nodesIdsInRoutes = [];
        let line = null;

        // first line
        const randomNode = randomRange(0, nodes.length);
        // line for near node
        if (!nodes[randomNode].nodesInRadius || nodes[randomNode].nodesInRadius.length === 0) {
            // TDOD Можно эту ноду подсвечивать крассным
            alert(`Для точки ${nodes[randomNode].id} нет ближайших мотов.`);
        } else {
            line = this.getLineForNearNode(nodes[randomNode]);
            nodesIdsInRoutes.push([line.idNode, line.idNexNode]);
            lines.push(line);
        }

        // ---test---

        while (nodesIdsInRoutes.length !== nodes.length) {
            const nextNode = this.getNodeWithLine(nodes, line);

            if (!nextNode || !nextNode.nodesInRadius || nextNode.nodesInRadius.length === 0) {
                // TDOD Можно эту ноду подсвечивать крассным
                console.log(`Для точки ${nodes[randomNode].id} нет ближайших мотов.`);
                nodesIdsInRoutes.push(line.idNexNode);
            } else {
                line = this.getLineForMinimumPerimeter(nextNode, line, nodesIdsInRoutes);

                if (!line) {
                    // TDOD Можно эту ноду подсвечивать крассным
                    console.log('Маршрут окончен нет ближайших точек');
                }

                lines.push(line);
                nodesIdsInRoutes.push(line.idNexNode);
            }
        }
        // ---test---

        return lines;
    }

    getOpticsAlgorithmLines(nodes) {
        const nodesWithNearNodes = this.getRadiusNodes(nodes);
        const linesWithNodes = this.makeOpticsCluster(nodesWithNearNodes);


        return linesWithNodes;
    }

    opticsAlgorithm = (nodes) => {
        const lines = this.getOpticsAlgorithmLines(nodes);

        if (lines.length !== 0) {
            this.props.dispatch(generateLines(lines));
        }
    }

    // --------------------------------------

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
        } = this.state;

        const canvas = this.canvasRef;
        const ctx = canvas.getContext('2d');

        CanvasService.clearCanvas(ctx, layoutWidth, layoutHeight);
        // all nodes
        CanvasService.renderNodes(ctx, nodes);
        // render radius
        if (showRange) CanvasService.renderNodesRadius(ctx, nodes);
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
    nodes: PropTypes.array,
    lines: PropTypes.array,
};

export default Network;

