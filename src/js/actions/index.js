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
