import * as types from '../../src/actions/actionTypes'

export function billingActivity(state = [], action) {
    switch (action.type) {
        case types.LOAD_BILLING_ACTIVITY:
            return [{ type: action.type, data: action.data }]
        case types.LOAD_BILLINGID:
            return [{ type: action.type, data: action.data }]
        case types.LOAD_STARTID:
            return [{ type: action.type, data: action.data }]
        case types.UPDATE_BILLING_ACTIVITY:
            return [{ type: action.type, status: action.status }]
        default:
            return state;
    }
}