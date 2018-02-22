
import * as types from '../../src/actions/actionTypes'


export function devSetting(state = [], action) {
    switch (action.type) {
        case types.LOAD_APP:
            return [...state, { type: action.type, data: action.data }]
        case types.LOAD_DEVSETTING:
            return [...state, { type: action.type, data: action.data }]
        case types.UPDATE_DEVSETTING:
            return [...state, { type: action.type, status: action.status }]
        default:
            return state;
    }
}