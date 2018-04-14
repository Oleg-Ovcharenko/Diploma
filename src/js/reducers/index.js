import {
    ADD_NETWORK_WINDOW_SIZES,
    GENERATE_NODES,
    GENERATE_MAIN_NODE,
    GENERATE_LINES,
    SHOW_RANGE_NODES,
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
                    show: state.ui.show,
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
        case GENERATE_LINES: {
            const lines = {
                lines: action.lines,
            };
            return { ...state, ...lines };
        }
        case SHOW_RANGE_NODES: {
            const ui = {
                ui: {
                    networkPanel: state.ui.networkPanel,
                    show: !state.ui.show,
                },
            };
            return { ...state, ...ui };
        }
        default:
            return state;
    }
}
