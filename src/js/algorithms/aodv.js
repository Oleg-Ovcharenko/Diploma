class aodv {
    static makeAodv(nodes, mainNode) {
        const lines = [];
        const idNodeInRoute = [];
        const idNodeWithoutRoute = [];
        let nodesNeedToCheck = [];

        // find nodes with small radius
        // let nodeWithoutRouteId = null;

        // nodes.map((nodeItem) => {
        //     if (nodeItem.nodesInRadius.length === 0) {
        //         nodeWithoutRouteId = nodeItem.id;
        //         nodes.map((findNodeById) => {
        //             findNodeById.nodesInRadius.map((nodesInRoute) => {
        //                 if (nodesInRoute.id === nodeItem.id) {
        //                     nodeWithoutRouteId = null;
        //                 }
        //             });
        //         });

        //         if (nodeWithoutRouteId && idNodeWithoutRoute.indexOf(nodeWithoutRouteId) === -1) {
        //             idNodeWithoutRoute.push(nodeWithoutRouteId);
        //         }
        //     }
        // });

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

        while ((idNodeInRoute.length + idNodeWithoutRoute.length) !== nodes.length + 1) {
            const newNeedToCheckNodes = [];

            nodesNeedToCheck.map((itemId) => {
                const findItem = nodes.find((findingItem) => {
                    if (findingItem.id === itemId) {
                        return findingItem;
                    }
                });

                if (findItem.nodesInRadius.length !== 0) {
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
        }

        return lines;
    }
}

export default aodv;
