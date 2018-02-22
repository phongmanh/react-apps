
import * as types from '../../src/actions/actionTypes'

export function modules(state = [], action) {
    switch (action.type) {
        case types.LOAD_MODULE:
            return [{ type: action.type, data: action.data }]
        case types.UPDATE_MODULE:
            return [{ type: action.type, status: action.status }]
        default:
            return state;
    }
}