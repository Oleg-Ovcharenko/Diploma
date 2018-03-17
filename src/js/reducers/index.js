import {
    ADD_NETWORK_WINDOW_SIZES,
    GENERATE_NODES,
    GENERATE_LINES,
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

        case GENERATE_LINES: {
            const lines = {
                lines: action.lines,
            };

            return { ...state, ...lines };
        }

        default:
            return state;
    }
}
