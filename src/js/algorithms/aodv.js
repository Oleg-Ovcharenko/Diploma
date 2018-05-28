class aodv {
    static makeAodv(nodes, mainNode) {
        const lines = [];
        const idNodeInRoute = [];
        const idNodeWithoutRoute = [];
        let nodesNeedToCheck = [];

        for (let i = 0; i < mainNode.nodesInRadius.length; i += 1) {

            const findNearNode = nodes.find((item) => {
                if (item.id === mainNode.nodesInRadius[i].id) {
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
        }

        {
            const newNeedToCheckNodes = [];

            nodesNeedToCheck.map((itemId) => {
                const findItem = nodes.find((findingItem) => {
                    if (findingItem.id === itemId) {
                        return findingItem;
                    }
                });

                findItem.nodesInRadius.map((item) => {
                    if (idNodeInRoute.indexOf(item.id) === -1) {
                        idNodeInRoute.push(item.id);
                    }

                    if (newNeedToCheckNodes.indexOf(item.id) === -1 && item.id !== 'MAIN') {
                        newNeedToCheckNodes.push(item.id);
                    }

                    lines.push({
                        idNode: findItem.id,
                        idNexNode: item.id,
                        x1: findItem.x,
                        x2: item.x,
                        y1: findItem.y,
                        y2: item.y,
                    });
                });
            });


            console.log(newNeedToCheckNodes);


            // for (let i = 0; i < nodesNeedToCheck.length; i += 1) {

            //     let findNearNode = null;
            //     for (let j = 0; j < nodes.length; j += 1) {
            //         if (nodesNeedToCheck.indexOf(nodes[j].id) !== -1) {
            //             findNearNode = nodes[j];
            //             break;
            //         }
            //     }


            //     for (let k = 0; k < findNearNode.nodesInRadius.length; k += 1) {
            //         console.log(findNearNode.nodesInRadius[k].id);
            //         if (findNearNode.nodesInRadius[k].id === findNearNode.id) {
            //             if (idNodeInRoute.indexOf(findNearNode.id) === -1) {
            //                 idNodeInRoute.push(findNearNode.id);
            //             }

            //             if (newNeedToCheckNodes.indexOf(findNearNode.id) === -1) {
            //                 newNeedToCheckNodes.push(findNearNode.id);
            //             }

            //             lines.push({
            //                 idNode: findNearNode.nodesInRadius[k].id,
            //                 idNexNode: findNearNode.id,
            //                 x1: findNearNode.nodesInRadius[k].x,
            //                 x2: findNearNode.x,
            //                 y1: findNearNode.nodesInRadius[k].y,
            //                 y2: findNearNode.y,
            //             });
            //         }
            //     }
            // }

            // nodesNeedToCheck = newNeedToCheckNodes;
        }

        return lines;
    }
}

export default aodv;
