// LIBRARIES
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eventEmmiter from '../../utils/eventEmmiter';
// SERVICE
import CanvasService from '../../services/CanvasService';
import CalculationService from '../../services/CalculationService';
// ACTIONS
import { addNetworkWindowSize, generateLines } from '../../actions';
// HELPERS
import { randomRange } from './../../helpers/helpersFunctions';
// CONSTANTS
import { NODE_RADIUS } from '../../constants';

const MAIN_NODE = 'MAIN';

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
        setTimeout(() => {
            this.renderNetwork(nextProps);
            this.setState({
                nodes: nextProps.nodes,
            });
        }, 0);
    }

    componentWillUpdate(nextProps) {
        this.renderNetwork(nextProps);
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

    // BUILD ALGHORITHM

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

    // получить ребро для ближайшей точки в радиусе
    getLineForNearNode(node) {
        let minDistance = null;
        let nearNode = null;

        node.nodesInRadius.map((item) => {
            const distanceNow = CalculationService.distanceBetweenNodes(node.x, item.x, node.y, item.y);
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
        }

        return false;
    }

    // получить ребро по минимальному периметру
    getLineForMinimumPerimeter(node, prevLine, buildRouteIds) {
        let minPerimeter = null;
        let nearNode = null;

        node.nodesInRadius.map((item) => {
            if (item.id !== prevLine.idNode && item.id !== prevLine.idNexNode && buildRouteIds.indexOf(item.id) === -1) {
                const perimeterNow = CalculationService.trianglePerimeter(prevLine.x1, prevLine.y1, prevLine.x2, prevLine.y2, item.x, item.y);
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
        }

        return false;
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

        // Генерируем массив id с полученных нод
        const randomIds = [];
        nodes.map((item) => {
            randomIds.push(item.id);
        });

        while (randomIds.length !== 0 && ((idNodeInRoute.length + idNodeWithoutRoute.length) !== nodes.length)) {
            // ПОЛУЧЕНИЕ ЛИНИИ ДЛЯ ТОЧКИ НА МИНИМАЛЬНОМ РАССТОЯНИИ
            if (!line) {
                // Выбираем случайный элемент массива
                const indexRandomNode = randomRange(0, randomIds.length - 1);
                const idRandomNode = randomIds[indexRandomNode];
                randomIds.splice(indexRandomNode, 1);

                // Находим точку по этому элементу
                const node = nodes.find((item) => {
                    if (item.id === idRandomNode) {
                        return item;
                    }
                });

                // Если у выбранной точки нет ближайших точек
                if (!node || !node.nodesInRadius || node.nodesInRadius.length === 0) {
                    if (idNodeInRoute.indexOf(node.id) === -1) {
                        idNodeWithoutRoute.push(node.id);
                    }
                    buildRouteIds = []; // Сбрасываем все построение предыдущего маршрута
                    line = false; // Сбрасываем предущие значение линии для начала построения нового маршрута на следующей итерации
                } else {
                    line = this.getLineForNearNode(node); // Получаем точку на минимальном расстоянии

                    // При попадании NextNode в главную точку прекращаем построение маршрута
                    if (line.idNexNode === MAIN_NODE) {
                        idNodeInRoute.push(line.idNode); // добавляем точку как ту что находится в маршруте
                        lines.push(line); // добавляем линию в массив линий на отрисовку
                        // Удаляем с массива id для получения случайной точки
                        if (randomIds.indexOf(line.idNode) !== -1) {
                            randomIds.splice(randomIds.indexOf(line.idNode), 1);
                        }
                        // Обнуляем маршрут
                        buildRouteIds = [];
                        line = null;
                        // Если полученной idNexNode нет в маршруте то добавляем её в машрут
                    } else if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                        lines.push(line); // добавляем линию в массив линий на отрисовку

                        // Так как это новый маршрут заносим в масив точек входящих в маршрут idNode и idNexNode
                        if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                            idNodeInRoute.push(line.idNode, line.idNexNode);
                            buildRouteIds.push(line.idNode, line.idNexNode);
                        }

                        // Удаляем с массива id для получения случайной точки
                        if (randomIds.indexOf(line.idNexNode) !== -1) {
                            randomIds.splice(randomIds.indexOf(line.idNexNode), 1);
                        }
                    } else {
                        // Если следующая точка входит в маршрут то предыдущую заносим в маршрут и обнуляем его
                        idNodeInRoute.push(line.idNode);
                        lines.push(line);
                        buildRouteIds = [];
                        line = null;
                    }
                }
                // Если на предущем этапе была полученна линия
            } else {
                // получаем крайнюю в линии точку
                const nextNode = this.getNodeWithLine(nodes, line);

                // Если нет ближайших точек обнуляем маршрут
                if (!nextNode || !nextNode.nodesInRadius || nextNode.nodesInRadius.length === 0) {
                    line = null;
                    buildRouteIds = [];
                } else {
                    // Ищем следующую точку по минимальному периметру
                    line = this.getLineForMinimumPerimeter(nextNode, line, buildRouteIds);

                    // Если не получили линию обнуляем маршрут
                    if (!line) {
                        line = null;
                        buildRouteIds = [];
                    // Попали в главную точку. Добавляем линию на отрисовку и обнуляем маршрут
                    } else if (line.idNexNode === MAIN_NODE) {
                        lines.push(line);
                        buildRouteIds = [];
                        line = null;
                    // Если в маршруте нет выбранной нами точки до заносим её в машрут
                    } else if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                        lines.push(line); // добавляем линию на отрисовку

                        idNodeInRoute.push(line.idNexNode);
                        buildRouteIds.push(line.idNexNode);

                        // Удаляем с массива id для получения случайной точки
                        if (randomIds.indexOf(line.idNexNode) !== -1) {
                            randomIds.splice(randomIds.indexOf(line.idNexNode), 1);
                        }

                        // Если новая точка была помечена как та у которой нет ближайших удаем её с массива
                        if (idNodeWithoutRoute.indexOf(line.idNexNode) !== -1) {
                            idNodeWithoutRoute.splice(idNodeWithoutRoute.indexOf(line.idNexNode), 1);
                        }
                    // Если точка уже есть в маршуре отрисовываем линию и обнуляем маршурт
                    } else {
                        lines.push(line);
                        buildRouteIds = [];
                        line = null;
                    }
                }
            }
        }

        return lines;
    }

    buildAlgorthm = () => {
        this.opticsAlgorithm(this.props.nodes, this.props.mainNode);
    }

    opticsAlgorithm = (nodes, mainNode) => {
        const nodesWithNearNodes = this.getRadiusNodes(nodes, mainNode);
        const linesWithNodes = this.makeOpticsCluster(nodesWithNearNodes);

        if (linesWithNodes.length !== 0) {
            this.props.dispatch(generateLines(linesWithNodes));
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
};

export default Network;

