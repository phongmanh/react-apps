import React, { Component } from 'react'
import { Row, Form, Button, Input, Select, Spin, message, Modal, Table } from 'antd'
import * as devSettingAction from '../../src/actions/devSettingAction'
import * as devModeAction from '../../src/actions/devModeAction'
import * as devModuleAction from '../../src/actions/devModuleAction'
import * as moduleAction from '../../src/actions/moduleAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'


class DeviceMulti extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount(){
        this.props.load_ModeData();
        this.props.load_DevModuleData();
        this.props.load_DevSettingData();
    }

    render() {

        const { data_DevMode, data_DevModule, data_DevSetting } = this.props



        const _columns = [
            {
                title: "Device",
                key: "devMacaddress",
                dataIndex: "devMacaddress"
            },
            {
                title: "Device Mode",
                children: [
                    {
                        title: "Mode",
                        key: "modeID",
                        dataIndex: "modeID"
                    },
                    {
                        title: "Bus",
                        key: "devBusID",
                        dataIndex: "devBusID"
                    }
                ]
            },
            {
                title: "Device Module",
                children: [
                    {
                        title: "Module",
                        key: "moduleId",
                        dataIndex: "moduleId"
                    },
                    {
                        title: "Enable",
                        key: "devModuleEnable",
                        dataIndex: "devModuleEnable"
                    },
                    {
                        title: "Default",
                        key: "isDefault",
                        dataIndex: "isDefault"
                    }
                ]
            },
            {
                title: "Device Setting",
                children: [
                    {
                        title: "Setting Name",
                        key: "settingName",
                        dataIndex: "settingName"
                    },
                    {
                        title: "Value",
                        key: "settingValue",
                        dataIndex: "settingValue"
                    }
                ]
            }
        ]

        let _dataSource = []

        if (data_DevMode.length > 0){
            Object.assign(_dataSource, data_DevMode)
        }
        if (data_DevSetting.length > 0){
            Object.assign(_dataSource, data_DevSetting)
        }
        if (data_DevModule.length > 0){
            Object.assign(_dataSource, data_DevModule)
        }

        

        return (
            <div id="edulog">
                <Table dataSource={_dataSource} columns={_columns} bordered={false}

                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    let _DevSettingData = []
    let _DevModeData = []
    let _devModuleData = []

    if (state.DevModuleData.length > 0) {
        _devModuleData = state.DevModuleData[state.DevModuleData.length - 1].data
    }
    if (state.DevModeData.length > 0) {
        _DevModeData = state.DevModeData[state.DevModeData.length - 1].data
    }

    if (state.DevSettingData.length > 0) {
        _DevSettingData = state.DevSettingData[state.DevSettingData.length - 1].data
    }

    return {
        data_DevSetting: _DevSettingData,
        data_DevMode: _DevModeData,
        data_DevModule: _devModuleData
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        update_DevSetting: (body) => dispatch(devSettingAction.update_DevSetting(body)),
        load_DevSettingData: () => dispatch(devSettingAction.load_DevSetting()),
        update_DevModule: (body) => dispatch(devModuleAction.update_DevModule(body)),
        load_DevModuleData: () => {
            dispatch(devModuleAction.load_DevModule());
            dispatch(moduleAction.load_Module());
        },
        update_DevMode: (body) => dispatch(devModeAction.update_devMode(body)),
        load_ModeData: () => {
            dispatch(devModeAction.load_Mode());
            dispatch(devModeAction.load_devMode());
        },
        resetStatus: () => dispatch({ type: types.UPDATE_DEVSETTING, status: "" }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DeviceMulti)