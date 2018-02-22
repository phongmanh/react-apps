
import * as types from '../../src/actions/actionTypes'

export function files(state = [], action) {
    switch (action.type) {
        case types.LOAD_FILES:
            return [{ type: action.type, data: action.data }]
        case types.UPDATE_FILES:
            return [{ type: action.type, status: action.status }]
        default:
            return state;
    }
}