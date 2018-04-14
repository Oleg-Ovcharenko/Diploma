export const ADD_NETWORK_WINDOW_SIZES = 'ADD_NETWORK_WINDOW_SIZES';
export function addNetworkWindowSize(width, height) {
    return {
        type: ADD_NETWORK_WINDOW_SIZES,
        width,
        height,
    };
}

export const GENERATE_NODES = 'GENERATE_NODES';
export function generateNodes(nodes) {
    return {
        type: GENERATE_NODES,
        nodes,
    };
}

export const GENERATE_LINES = 'GENERATE_LINES';
export function generateLines(lines) {
    return {
        type: GENERATE_LINES,
        lines,
    };
}

export const GENERATE_MAIN_NODE = 'GENERATE_MAIN_NODE';
export function generateMainNode(node) {
    return {
        type: GENERATE_MAIN_NODE,
        node,
    };
}

export const SHOW_RANGE_NODES = 'SHOW_RANGE_NODES';
export function showRangeNodes() {
    return {
        type: SHOW_RANGE_NODES,
    };
}
