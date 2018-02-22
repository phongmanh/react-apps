import * as types from './actionTypes'
import * as api from '../../src/api/pageAPI'
import 'whatwg-fetch'



export function update_Module(body) {
    return dispatch => {
        dispatch(fetch_DataWithBody(types.UPDATE_MODULE, api.Module_Update_Url, 'POST', body))
    }
}

export function load_Module() {
    return dispatch => {
        dispatch(fetch_Data(types.LOAD_MODULE, api.Module_Url));
    }
}

function push_Data(type, results) {
    switch (type) {
        case types.UPDATE_MODULE:
            return {
                type,
                status: results
            }
        default:
            return {
                type: type,
                data: results
            }
    }
}

function fetch_Data(type, url) {
    return dispatch => {
        fetch(url, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            contentType: 'json'
        }).then(function (res) {
            if (res.ok) {
                return res.json();
            } else {
                console.log("Failed. type: " + type + " Url: " + url);
            }
        }).then(function (data) {
            dispatch(push_Data(type, data))
        }).catch(function (e) {
            console.log("Failed. type: " + type + " Url: " + url);
            console.log(e)
        })
    }
}

function fetch_DataWithBody(type, url, method, body) {
    return dispatch => {
        fetch(url, {
            method: method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            contentType: 'json',
            body: JSON.stringify(body),
        }).then(function (res) {
            if (res.ok) {
                if (type === types.UPDATE_MODULE) {
                    return types.UPDATE_SUCCESS
                }
                return res.json();
            } else {
                console.log("Failed. type: " + type + " Url: " + url);
                if (type === types.UPDATE_MODULE) {
                    return types.UPDATE_FAILED
                }
                return 'FAILED'
            }
        }).then(function (data) {
            dispatch(push_Data(type, data))
        }).catch(function (e) {
            console.log("Failed. type: " + type + " Url: " + url);
            console.log(e)
        })
    }
}

