class aodv {
    /**
     * Пошук точок в радіус дії якої входить головна точка
     */
    static getNearNode(nodes, nodeNeedToCheck) {
        return nodes.find((item) => {
            if (item.id === nodeNeedToCheck.id) {
                return item;
            }
        });
    }

    /** Побудова алгоритму */
    static makeAodv(nodes, mainNode) {
        const lines = [];
        const idNodeInRoute = [];
        let nodesNeedToCheck = [];

        /**
         * Якщо в радіусі дії головної точки немає найбліжчих точок
         * */
        if (mainNode.nodesInRadius.length === 0) {
            alert('In the radius of the main point there are no points');
            return []; /** Повертаємо порожній масив */
        }

        /**
         * Пошук точок які знаходяться в радіусі дії головної точки
         */
        mainNode.nodesInRadius.map((nodeInMainNode) => {
            const findNearNode = this.getNearNode(nodes, nodeInMainNode);

            /**
             * Зеднуюємо головну точку з шуканими
             * */
            findNearNode.nodesInRadius.map((item) => {
                if (item.id === mainNode.id) {
                    /** Головна точка не повинна буду в маршруті */
                    if (idNodeInRoute.indexOf(mainNode.id) === -1) {
                        idNodeInRoute.push(mainNode.id);
                    }

                    /** Шукана точка не повінна будти в маршруті */
                    if (idNodeInRoute.indexOf(findNearNode.id) === -1) {
                        idNodeInRoute.push(findNearNode.id);
                    }

                    /** Шукана точка не повинна міститися в масиві на пошук */
                    if (nodesNeedToCheck.indexOf(findNearNode.id) === -1) {
                        nodesNeedToCheck.push(findNearNode.id);
                    }

                    /** Додаємо нову лінію */
                    lines.push({
                        idNode: mainNode.id,
                        idNexNode: findNearNode.id,
                        x1: mainNode.x,
                        x2: findNearNode.x,
                        y1: mainNode.y,
                        y2: findNearNode.y,
                    });
                }
            });
        });

        let nodesWithoutRoute = true; /** Точки без найближчих точок або з точками яки вже є в маршруті */

        while (nodesNeedToCheck.length !== nodesWithoutRoute) {
            const newNeedToCheckNodes = []; /** Точки які будуть перевірені на наступній ітерації циклу */
            let countNodesWithoutRoute = 0; /** Підрахунок точок які не входять в радіс дії певної точки або вже є в маршруті */

            /** Перевіряємо точки в масиві який було сформовано на колишньому етапі */
            nodesNeedToCheck.map((itemId) => {
                const findItem = this.getNearNode(nodes, { id: itemId });

                /**
                 * Перевіряем чи є точки в радіусі дії певної точки
                 * та чи є такі точки які не входять в машрут. Якщо немае то заносимо ії як без маршруту
                 */
                if (findItem.nodesInRadius.length !== 0) {
                    for (let i = 0; i < findItem.nodesInRadius.length; i += 1) {
                        if (idNodeInRoute.indexOf(findItem.nodesInRadius[i].id) === -1) {
                            countNodesWithoutRoute = 0;
                            break;
                        } else {
                            countNodesWithoutRoute += 1;
                        }
                    }
                } else {
                    countNodesWithoutRoute += 1;
                }

                /** Якщо в шуканих точках є точкі в радіусі їх дії то віконуємо побудову ліній */
                if (countNodesWithoutRoute === 0) {
                    findItem.nodesInRadius.map((item) => {
                        /** Перевіряемо, що знайденої точки немає в масиві на перевірку та вона не головна */
                        if (newNeedToCheckNodes.indexOf(item.id) === -1 && item.id !== 'MAIN') {
                            newNeedToCheckNodes.push(item.id);
                        }

                        /** Перевіряемо, за знайденої точки немає в масиві точок які входять в маршрут та будуємо лінію */
                        if (idNodeInRoute.indexOf(item.id) === -1) {
                            idNodeInRoute.push(item.id);

                            /** Додаємо нову лінію */
                            lines.push({
                                idNode: findItem.id,
                                idNexNode: item.id,
                                x1: findItem.x,
                                x2: item.x,
                                y1: findItem.y,
                                y2: item.y,
                            });
                        }
                    });
                }
            });

            /** Додаємо нові точки які слід перевірити */
            nodesNeedToCheck = newNeedToCheckNodes;
            /** Додаємо точки які не можут входити в маршрут */
            nodesWithoutRoute = countNodesWithoutRoute;
        }

        return lines;
    }
}

export default aodv;
