

import * as types from '../../src/actions/actionTypes'


export function device(state = [], action) {
    switch (action.type) {
        case types.LOAD_DEV:
            return [...state, { type: action.type, data: action.data }]
        case types.UPDATE_DEV:
            return [...state, { type: action.type, status: action.status }]
        default:
            return state;
    }
}