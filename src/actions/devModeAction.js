import * as types from './actionTypes'
import * as api from '../../src/api/pageAPI'
import 'whatwg-fetch'



export function update_devMode(body) {
    return dispatch => {
        dispatch(fetch_DataWithBody(types.UPDATE_DEVMODE, api.DevMode_Update_Url, 'POST', body))
    }
}

export function load_devMode() {
    return dispatch => {
        dispatch(fetch_Data(types.LOAD_DEVMODE, api.DevMode_Url));
    }
}

export function load_Mode(){
    return dispatch => {
        dispatch(fetch_Data(types.LOAD_MODE, api.mdmMode_Url));
    }
}

function push_Data(type, results) {
    switch (type) {
        case types.UPDATE_DEVMODE:
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
                if (type === types.UPDATE_DEVMODE) {
                    return types.UPDATE_SUCCESS
                }
                return res.json();
            } else {
                console.log("Failed. type: " + type + " Url: " + url);
                if (type === types.UPDATE_DEVMODE) {
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

