// SERVICE
import CalculationService from '../services/CalculationService';
// HELPERS
import { randomRange } from './../helpers/helpersFunctions';

const MAIN_NODE = 'MAIN';

class Optics {
    // получить следующую точку с линии
    static getNodeWithLine = (nodes, line) => nodes.find((item) => item.id === line.idNexNode ? item : null);

    // получить ребро для ближайшей точки в радиусе
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

    // получить ребро по минимальному периметру
    static getLineForMinimumPerimeter(node, prevLine, buildRouteIds) {
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

    static makeOptics(nodes) {
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
                    line = Optics.getLineForNearNode(node); // Получаем точку на минимальном расстоянии

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
                const nextNode = Optics.getNodeWithLine(nodes, line);

                // Если нет ближайших точек обнуляем маршрут
                if (!nextNode || !nextNode.nodesInRadius || nextNode.nodesInRadius.length === 0) {
                    line = null;
                    buildRouteIds = [];
                } else {
                    // Ищем следующую точку по минимальному периметру
                    line = Optics.getLineForMinimumPerimeter(nextNode, line, buildRouteIds);

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
}

export default Optics;
