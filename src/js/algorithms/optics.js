// SERVICE
import CalculationService from '../services/CalculationService';
// HELPERS
import { randomRange } from './../helpers/helpersFunctions';
import { MAIN_NODE } from '../constants';

class Optics {
    /** Отримати наступну точку для отриманої лінії */
    static getNodeWithLine = (nodes, line) => nodes.find((item) => item.id === line.idNexNode ? item : null);

    /** Отримати лінію для найближчої точки в радіусі */
    static getLineForNearNode(node) {
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

    /** Отримати лінію для найменьшого периметру в радісі дії певної точки */
    static getLineForMinimumPerimeter(node, prevLine, buildRouteIds) {
        let minPerimeter = null;
        let nearNode = null;

        node.nodesInRadius.map((item) => {
            if (item.id !== prevLine.idNode
                && item.id !== prevLine.idNexNode
                && buildRouteIds.indexOf(item.id) === -1) {
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

    /** Побудова алгоритму */
    static makeOptics(nodes) {
        const lines = [];
        const idNodeInRoute = [];
        const idNodeWithoutRoute = [];
        const randomIds = [];
        let buildRouteIds = [];
        let line = false;

        /** Отримати масив id точок */
        nodes.map((item) => randomIds.push(item.id));

        while (randomIds.length !== 0 && ((idNodeInRoute.length + idNodeWithoutRoute.length) !== nodes.length)) {
            /** Отримати точки для мінімальної відстані */
            if (!line) {
                /** Отримати випадкову точку */
                const indexRandomNode = randomRange(0, randomIds.length - 1);
                const idRandomNode = randomIds[indexRandomNode];
                randomIds.splice(indexRandomNode, 1);

                /** Занаходимо віпадкову точку по id в масиві точок */
                const node = nodes.find((item) => {
                    if (item.id === idRandomNode) {
                        return item;
                    }
                });

                /** Якщо в радіусі дії знайденої точки немає найближчих точок */
                if (!node || !node.nodesInRadius || node.nodesInRadius.length === 0) {
                    if (idNodeInRoute.indexOf(node.id) === -1) {
                        idNodeWithoutRoute.push(node.id);
                    }
                    buildRouteIds = []; /** Скидаємо побудову попреденього маршруту */
                    line = false; /** Скижаємо попередні значенная ліній для початку побудови нового маршруту на наступній ітерації */
                } else {
                    /** Отримуємо точку на яка знаходиться на мінімальній відстані */
                    line = Optics.getLineForNearNode(node);

                    /** Якщо NextNode буду головною точкою за занічуємо побудову цього маршруту */
                    if (line.idNexNode === MAIN_NODE) {
                        idNodeInRoute.push(line.idNode); /** Добавляємо точку як ту що знаходіться в маршруті */
                        lines.push(line); /** Добавляємо нову лінію */
                        /** Выдаляемо id новой точки за масыву де беремо нову точку для побудови маршруту */
                        if (randomIds.indexOf(line.idNode) !== -1) {
                            randomIds.splice(randomIds.indexOf(line.idNode), 1);
                        }
                        /** Обуняємо маршрут */
                        buildRouteIds = [];
                        line = null;
                        /** Якщо отриманої idNexNode немає в маршруті то добавляємо її в маршрут */
                    } else if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                        lines.push(line); /** Добавляємо нову лінію */

                        /** Так як це новий маршрут то заносимо в масив точок які входять в маршрут idNode та idNexNode */
                        if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                            idNodeInRoute.push(line.idNode, line.idNexNode);
                            buildRouteIds.push(line.idNode, line.idNexNode);
                        }

                        /** Выдаляемо id новой точки за масыву де беремо нову точку для побудови маршруту */
                        if (randomIds.indexOf(line.idNexNode) !== -1) {
                            randomIds.splice(randomIds.indexOf(line.idNexNode), 1);
                        }
                    } else {
                        /** Якщо наступна точка входить в маршрут то попредню точку заносимо в маршрут та обнуляємо його */
                        idNodeInRoute.push(line.idNode);
                        lines.push(line);
                        buildRouteIds = [];
                        line = null;
                    }
                }
            /** Якщо на попередньому єтапі була отримана лінія */
            } else {
                /** Отримати наступну точку для отриманої лінії */
                const nextNode = Optics.getNodeWithLine(nodes, line);

                /** Якщо немає найближчих точок то обнуляємо маршрут */
                if (!nextNode || !nextNode.nodesInRadius || nextNode.nodesInRadius.length === 0) {
                    line = null;
                    buildRouteIds = [];
                } else {
                    /** Шукаємо наступну точку по мінімальному периметру */
                    line = Optics.getLineForMinimumPerimeter(nextNode, line, buildRouteIds);

                    /** Якщо не отримали лінію то обнуляємо маршрут */
                    if (!line) {
                        line = null;
                        buildRouteIds = [];
                    /** Якщо попали в головну точку. Добавляємо лінію та обнуляємо маршрут */
                    } else if (line.idNexNode === MAIN_NODE) {
                        lines.push(line);
                        buildRouteIds = [];
                        line = null;
                    /** Якщо в маршруті немає знайденої точки то заносимо її в маршрут */
                    } else if (idNodeInRoute.indexOf(line.idNexNode) === -1) {
                        lines.push(line); // добавляем линию на отрисовку

                        idNodeInRoute.push(line.idNexNode);
                        buildRouteIds.push(line.idNexNode);

                        /** Выдаляемо id новой точки за масыву де беремо нову точку для побудови маршруту */
                        if (randomIds.indexOf(line.idNexNode) !== -1) {
                            randomIds.splice(randomIds.indexOf(line.idNexNode), 1);
                        }

                        /** Якщо нова точка була помічена як так у якої немає найближчих точок то видялємо її */
                        if (idNodeWithoutRoute.indexOf(line.idNexNode) !== -1) {
                            idNodeWithoutRoute.splice(idNodeWithoutRoute.indexOf(line.idNexNode), 1);
                        }
                    /** Якщо точка знаходиться в маршруті то добаляемо нову лінію */
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
}

export default Optics;
