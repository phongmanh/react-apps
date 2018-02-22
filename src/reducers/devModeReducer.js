

import * as types from '../../src/actions/actionTypes'


export function devMode(state = [], action) {
    switch (action.type) {
        case types.LOAD_DEVMODE:
            return [...state, { type: action.type, data: action.data }]
        case types.LOAD_MODE:
            return [...state, { type: action.type, data: action.data }]
        case types.UPDATE_DEVMODE:
            return [...state, { type: action.type, status: action.status }]
        default:
            return state;
    }
}