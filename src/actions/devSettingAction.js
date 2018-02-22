
import * as types from './actionTypes'
import * as api from '../../src/api/pageAPI'
import { load_Devices } from './deviceAction'
import 'whatwg-fetch'


function push_Data(type, results) {
    switch (type) {
        case types.UPDATE_DEVSETTING:
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

function push_Failed(type, status) {
    return {
        type: type,
        status: status
    }
}

export function load_Application() {
    return dispatch => { dispatch(fetch_Data(types.LOAD_APP, api.AppId_Url)) }
}


export function load_DevSetting() {
    return dispatch => { dispatch(fetch_Data(types.LOAD_DEVSETTING, api.DevSetting_Url)) }
}


export function update_DevSetting(body) {
    return dispatch => { dispatch(fetch_DataWithBody(types.UPDATE_DEVSETTING, api.DevSetting_Update_Url, "POST", body)) }
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
                return [];
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
                if (type === types.UPDATE_DEVSETTING) {
                    return types.UPDATE_SUCCESS
                }
                return res.json();
            } else {
                console.log("Failed. type: " + type + " Url: " + url);
                if (type === types.UPDATE_DEVSETTING) {
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


