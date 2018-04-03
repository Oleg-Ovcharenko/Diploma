import {
    ADD_NETWORK_WINDOW_SIZES,
    GENERATE_NODES,
    GENERATE_MAIN_NODE,
    CHANGE_ALGORITHM_STATUS,
} from '../actions';

export default function reducer(state = {}, action) {
    switch (action.type) {
        case ADD_NETWORK_WINDOW_SIZES: {
            const ui = {
                ui: {
                    networkPanel: {
                        width: action.width,
                        height: action.height,
                    },
                },
            };
            return { ...state, ...ui };
        }
        case GENERATE_NODES: {
            const nodes = {
                nodes: action.nodes,
            };

            return { ...state, ...nodes };
        }
        case GENERATE_MAIN_NODE: {
            const mainNode = {
                mainNode: action.node,
            };
            return { ...state, ...mainNode };
        }
        case CHANGE_ALGORITHM_STATUS: {
            const start = {
                controlNetwork: {
                    start: action.status,
                },
            };
            return { ...state, ...start };
        }
        default:
            return state;
    }
}
