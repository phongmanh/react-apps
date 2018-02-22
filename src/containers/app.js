
import React, { Component } from 'react'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'
import { Spin, Alert } from 'antd'
import Main from './main'



export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

        }
    }
    render() {
        return (
            <div>
                <Main />
            </div>

        )
    }
}
