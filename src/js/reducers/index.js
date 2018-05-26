import {
    ADD_NETWORK_WINDOW_SIZES,
    GENERATE_NODES,
    GENERATE_NODES_CHANGE_STATUS,
    GENERATE_MAIN_NODE,
    GENERATE_LINES,
    SHOW_RANGE_NODES,
    SELECT_ALGORITHM,
    BUILD_ALGORITHM_CHANGE_STATUS,
} from '../actions';

export default function reducer(state = {}, action) {
    switch (action.type) {
        case ADD_NETWORK_WINDOW_SIZES: {
            return Object.assign({}, state, {
                ui: {
                    ...state.ui,
                    networkPanel: {
                        width: action.width,
                        height: action.height,
                    },
                },
            });
        }
        case GENERATE_NODES: {
            return Object.assign({}, state, {
                nodes: action.nodes,
            });
        }
        case GENERATE_NODES_CHANGE_STATUS: {
            return Object.assign({}, state, {
                settings: {
                    ...state.settings,
                    generateNodes: action.status,
                },
            });
        }
        case BUILD_ALGORITHM_CHANGE_STATUS: {
            return Object.assign({}, state, {
                settings: {
                    ...state.settings,
                    buildAlgorithm: action.status,
                },
            });
        }
        case GENERATE_MAIN_NODE: {
            return Object.assign({}, state, {
                mainNode: action.node,
            });
        }
        case GENERATE_LINES: {
            return Object.assign({}, state, {
                lines: action.lines,
            });
        }
        case SHOW_RANGE_NODES: {
            return Object.assign({}, state, {
                ui: {
                    ...state.ui,
                    show: !state.ui.show,
                },
            });
        }
        case SELECT_ALGORITHM: {
            return Object.assign({}, state, {
                settings: {
                    ...state.settings,
                    selectedAlgorithm: action.data,
                },
            });
        }
        default:
            return state;
    }
}
