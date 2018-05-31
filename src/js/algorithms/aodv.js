class aodv {
    static makeAodv(nodes, mainNode) {
        const lines = [];
        const idNodeInRoute = [];
        let nodesNeedToCheck = [];

        if (mainNode.nodesInRadius.length === 0) {
            alert('In the radius of the main point there are no points');
            return [];
        }

        mainNode.nodesInRadius.map((nodeInMainNode) => {
            const findNearNode = nodes.find((item) => {
                if (item.id === nodeInMainNode.id) {
                    return item;
                }
            });

            findNearNode.nodesInRadius.map((item) => {
                if (item.id === mainNode.id) {
                    if (idNodeInRoute.indexOf(mainNode.id) === -1) {
                        idNodeInRoute.push(mainNode.id);
                    }

                    if (idNodeInRoute.indexOf(findNearNode.id) === -1) {
                        idNodeInRoute.push(findNearNode.id);
                    }

                    if (nodesNeedToCheck.indexOf(findNearNode.id) === -1) {
                        nodesNeedToCheck.push(findNearNode.id);
                    }

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

        let nodesWithoutRoute = true;

        while (nodesNeedToCheck.length !== nodesWithoutRoute) {
            const newNeedToCheckNodes = [];
            let countNodesWithoutRoute = 0;

            nodesNeedToCheck.map((itemId) => {
                const findItem = nodes.find((findingItem) => {
                    if (findingItem.id === itemId) {
                        return findingItem;
                    }
                });

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

                if (countNodesWithoutRoute === 0) {
                    findItem.nodesInRadius.map((item) => {

                        if (newNeedToCheckNodes.indexOf(item.id) === -1 && item.id !== 'MAIN') {
                            newNeedToCheckNodes.push(item.id);
                        }

                        if (idNodeInRoute.indexOf(item.id) === -1) {
                            idNodeInRoute.push(item.id);

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

            nodesNeedToCheck = newNeedToCheckNodes;
            nodesWithoutRoute = countNodesWithoutRoute;
        }

        return lines;
    }
}

export default aodv;
