import * as types from '../../src/actions/actionTypes'


export function sysSetting(state = [], action) {
    switch (action.type) {
        case types.LOAD_SETTING:
            return [...state, { type: action.type, data: action.data }]
        case types.UPDATE_SYSSETTING:
            return [{ type: action.type, status: action.status }]
        default:
            return state;
    }
}