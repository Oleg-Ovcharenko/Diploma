// LIBRARIES
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eventEmmiter from '../../utils/eventEmmiter';
// SERVICE
import CanvasService from '../../services/CanvasService';
// ACTIONS
import { addNetworkWindowSize, generateLines } from '../../actions';
// HELPERS
import { randomRange } from './../../helpers/helpersFunctions';
// CONSTANTS
import { NODE_RADIUS } from '../../constants';

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
        eventEmmiter.addListener('generateNodes', this.setSvgSizes);
        eventEmmiter.addListener('buildAlgorithm', this.buildAlgorthm);
        canvas.addEventListener('mousemove', this.showNodeTooltip);
    }

    componentWillReceiveProps(nextProps) {
        setTimeout(() => {
            this.renderNetwork(nextProps);
            this.setState({
                nodes: nextProps.nodes,
            });
        }, 0);
    }

    componentWillUpdate(nextProps, nextState) {
        this.renderNetwork(nextProps);
    }

    componentWillUnmount() {
        const canvas = this.canvasRef;
        eventEmmiter.removeAllListeners();
        canvas.removeEventListener('mousemove', this.showNodeTooltip);
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
    getRadiusNodes(nodes, mainNode) {
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

            if (this.checkNodeInRadius(nodes[i].x, nodes[i].y, nodes[i].params.radius / 2, mainNode.x, mainNode.y)) {
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

    buildAlgorthm = () => {
        this.opticsAlgorithm(this.props.nodes, this.props.mainNode);
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

    // получить ребро по минимальному периметру
    getLineForMinimumPerimeter(node, prevLine, buildRouteIds) {
        let minPerimeter = null;
        let nearNode = null;

        node.nodesInRadius.map((item) => {
            if (item.id !== prevLine.idNode && item.id !== prevLine.idNexNode && buildRouteIds.indexOf(item.id) === -1) {
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
        const idNodeInRoute = [];
        const idNodeWithoutRoute = [];
        let buildRouteIds = [];
        let line = false;

        const randomIds = [];
        nodes.map((item) => {
            randomIds.push(item.id);
        });

        /*----*/

        while ((idNodeInRoute.length + idNodeWithoutRoute.length) !== nodes.length) {
            if (!line) {
                const indexRandomNode = randomRange(0, randomIds.length - 1);
                const idRandomNode = randomIds[indexRandomNode];
                randomIds.splice(indexRandomNode, 1);

                const node = nodes.find((item) => {
                    if (item.id === idRandomNode) {
                        return item;
                    }
                });

                if (!node.nodesInRadius || node.nodesInRadius.length === 0) {
                    console.log(`Для точки ${node.id} нет ближайших мотов.`);
                    // предварительно заносим точку как в радиусе которой нет ближайших точек
                    if (idNodeInRoute.indexOf(node.id) === -1) {
                        idNodeWithoutRoute.push(node.id);
                    }
                    buildRouteIds = [];
                    line = false;
                } else {
                    line = this.getLineForNearNode(node);

                    if (line.idNexNode === 'MAIN') {
                        idNodeInRoute.push(line.idNode);
                        lines.push(line);
                        buildRouteIds = [];
                        line = null;

                        if (randomIds.indexOf(line.idNexNode) !== -1) {
                            randomIds.splice(randomIds.indexOf(line.idNexNode), 1);
                        }
                    } else if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                        lines.push(line);

                        if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                            idNodeInRoute.push(line.idNode, line.idNexNode);
                            buildRouteIds.push(line.idNode, line.idNexNode);
                        }

                        if (randomIds.indexOf(line.idNexNode) !== -1) {
                            randomIds.splice(randomIds.indexOf(line.idNexNode), 1);
                        }
                    } else {
                        idNodeInRoute.push(line.idNode);
                        lines.push(line);
                        buildRouteIds = [];
                        line = null;
                    }
                }
            } else {
                const nextNode = this.getNodeWithLine(nodes, line);

                if (!nextNode || !nextNode.nodesInRadius || nextNode.nodesInRadius.length === 0) {
                    line = null;
                    buildRouteIds = [];
                } else {
                    line = this.getLineForMinimumPerimeter(nextNode, line, buildRouteIds);

                    if (!line) {
                        line = null;
                        buildRouteIds = [];
                    } else if (line.idNexNode === 'MAIN') {
                        lines.push(line);
                        buildRouteIds = [];
                        line = null;
                    } else if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                        lines.push(line);

                        if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                            idNodeInRoute.push(line.idNexNode);
                            buildRouteIds.push(line.idNexNode);
                        }

                        if (randomIds.indexOf(line.idNexNode) !== -1) {
                            randomIds.splice(randomIds.indexOf(line.idNexNode), 1);
                        }

                        if (idNodeWithoutRoute.indexOf(line.idNexNode) !== -1) {
                            idNodeWithoutRoute.splice(idNodeWithoutRoute.indexOf(line.idNexNode), 1);
                        }
                    } else {
                        lines.push(line);
                        buildRouteIds = [];
                        line = null;
                    }
                }
            }
        }


    //     while ((idNodeInRoute.length + idNodeWithoutRoute.length) !== nodes.length) {
    //         if (!line) {
    //             const randomNode = randomRange(0, randomIds.length - 1);
    //             const id = randomIds[randomNode];
    //             randomIds.splice(randomNode, 1);

    //             const node = nodes.find((item) => {
    //                 if (item.id === id) {
    //                     return item;
    //                 }
    //             });

    //             if (!node || !node.nodesInRadius || node.nodesInRadius.length === 0) {
    //                 console.log(`Для точки ${node.id} нет ближайших мотов.`);
    //                 if (idNodeInRoute.indexOf(node.id) === -1) {
    //                     idNodeWithoutRoute.push(node.id);
    //                 }
    //                 buildRouteIds = [];
    //                 line = null;
    //             } else {
    //                 line = this.getLineForNearNode(node);

    //                 console.log(line);

    //                 if (!line) {
    //                     buildRouteIds = [];
    //                     line = null;
    //                 } else if (line.idNexNode === 'MAIN') {
    //                     if (idNodeInRoute.indexOf(line.idNode) === -1) {
    //                         idNodeInRoute.push(line.idNode);
    //                     }

    //                     if (idNodeWithoutRoute.indexOf(line.idNode) !== -1) {
    //                         idNodeWithoutRoute.splice(idNodeWithoutRoute.indexOf(line.idNode), 1);
    //                     }

    //                     lines.push(line);
    //                     line = null;
    //                     console.log('Попали в главную точку');
    //                 } else if (idNodeInRoute.indexOf(line.idNexNode) === -1 && idNodeInRoute.indexOf(line.idNode) === -1) {
    //                     if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
    //                         idNodeInRoute.push(line.idNexNode);
    //                         buildRouteIds.push(line.idNexNode);

    //                         //randomIds.splice(randomIds.indexOf(line.idNexNode), 1);
    //                     }

    //                     if (idNodeInRoute.indexOf(line.idNode) === -1) {
    //                         idNodeInRoute.push(line.idNode);
    //                         buildRouteIds.push(line.idNode);

    //                         //randomIds.splice(randomIds.indexOf(line.idNode), 1);
    //                     }

    //                     if (idNodeWithoutRoute.indexOf(line.idNode) !== -1) {
    //                         idNodeWithoutRoute.splice(idNodeWithoutRoute.indexOf(line.idNode), 1);
    //                     }

    //                     if (idNodeWithoutRoute.indexOf(line.idNexNode) !== -1) {
    //                         idNodeWithoutRoute.splice(idNodeWithoutRoute.indexOf(line.idNexNode), 1);
    //                     }

    //                     lines.push(line);
    //                 } else {
    //                     console.log(`Точка ${line.idNexNode} уже есть в маршруте`);
    //                     if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
    //                         idNodeInRoute.push(line.idNode);

    //                         //randomIds.splice(randomIds.indexOf(line.idNode), 1);
    //                     }

    //                     if (idNodeWithoutRoute.indexOf(line.idNexNode) !== -1) {
    //                         idNodeWithoutRoute.splice(idNodeWithoutRoute.indexOf(line.idNexNode), 1);
    //                     }

    //                     lines.push(line);
    //                     buildRouteIds = [];
    //                     line = null;
    //                 }
    //             }
    //         } else {
    //             const nextNode = this.getNodeWithLine(nodes, line);

    //             if (!nextNode || !nextNode.nodesInRadius || nextNode.nodesInRadius.length === 0) {
    //                 line = null;
    //                 buildRouteIds = [];
    //             } else {
    //                 line = this.getLineForMinimumPerimeter(nextNode, line, buildRouteIds);

    //                 if (!line) {
    //                     buildRouteIds = [];
    //                 } else if (line && line.idNexNode === 'MAIN') {
    //                     lines.push(line);
    //                     buildRouteIds = [];
    //                     line = null;
    //                 } else if (line && idNodeInRoute.indexOf(line.idNexNode) === -1) {
    //                     if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
    //                         idNodeInRoute.push(line.idNexNode);
    //                         buildRouteIds.push(line.idNexNode);

    //                         //randomIds.splice(randomIds.indexOf(line.idNexNode), 1);
    //                     }
    //                     if (idNodeWithoutRoute.indexOf(line.idNexNode) !== -1) {
    //                         idNodeWithoutRoute.splice(idNodeWithoutRoute.indexOf(line.idNexNode), 1);
    //                     }
    //                     lines.push(line);
    //                 } else {
    //                     lines.push(line);
    //                     buildRouteIds = [];
    //                     line = null;
    //                 }
    //             }
    //         }
    //     }

        console.log(idNodeInRoute);
        console.log(idNodeWithoutRoute);

        return lines;
    }

    getOpticsAlgorithmLines(nodes, mainNode) {
        const nodesWithNearNodes = this.getRadiusNodes(nodes, mainNode);
        const linesWithNodes = this.makeOpticsCluster(nodesWithNearNodes);


        return linesWithNodes;
    }

    opticsAlgorithm = (nodes, mainNode) => {
        const lines = this.getOpticsAlgorithmLines(nodes, mainNode);

        if (lines.length !== 0) {
            this.props.dispatch(generateLines(lines));
        }
    }

    // --------------------------------------

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
            if (this.checkNodeInRadius(nodes[i].x, nodes[i].y, NODE_RADIUS / 2, mouseX, mouseY)) {
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
        CanvasService.renderTooltip(ctx, showTooltip);
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

