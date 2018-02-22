
import * as types from '../../src/actions/actionTypes'

export function devModule(state = [], action) {
    switch (action.type) {
        case types.LOAD_DEVMODULE:
            return [...state, { type: action.type, data: action.data }]
        case types.UPDATE_DEVMODULE:
            return [...state, { type: action.type, status: action.status }]
        default:
            return state;
    }
}