import * as types from './actionTypes'
import * as api from '../../src/api/pageAPI'
import 'whatwg-fetch'
import $ from 'jquery'



export function create_Device(body) {
    return dispatch => {
        dispatch(fetch_DataWithBody(types.UPDATE_DEV, api.Dev_Create_Url, 'POST', body))
    }
}

export function delete_Device(body) {
    return dispatch => {
        dispatch(fetch_DataWithBody(types.UPDATE_DEV, api.Dev_Delete_Url, 'POST', body))
    }
}

export function load_Devices() {
    return dispatch => { dispatch(ajax_Request(types.LOAD_DEV, api.DevID_Url)) }
}

function push_Data(type, results) {
    switch (type) {
        case types.UPDATE_DEV:
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

function ajax_Request(type, url) {
    return dispatch => {
        $.ajax({
            type: 'GET',
            url: url,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
        }).done(function (rs) {
            dispatch(push_Data(type, rs))
        }).fail(function (xhr, status, err) {
            dispatch(push_Data(type, []))
            console.log(type, url, xhr)
        }).catch(function (xhr, status, err) {
            dispatch(push_Data(type, []))
            console.log(type, url, xhr);
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
                if (type === types.UPDATE_DEV) {
                    return types.UPDATE_SUCCESS
                }
                return res.json();
            } else {
                console.log("Failed. type: " + type + " Url: " + url);
                if (type === types.UPDATE_DEV) {
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

