import React, { Component } from 'react'
import { Row, Form, Button, Input, Select, Spin, message, Card } from 'antd'
import * as Actions from '../../src/actions/devModuleAction'
import * as moduleAction from '../../src/actions/moduleAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'


class DeviceModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false
        }

        this._save = false;
        this._moduleData = [];
        this._devModuleData = []
        this._Status = "";


        this._devModuleId = ""
        this._devId = ""
        this._devModuleEnable = "false"
        this._isDefault = "false"
        this._moduleId = "";


        this.handleModuleSelect = this.handleModuleSelect.bind(this);
        this.handleDevSelect = this.handleDevSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }


    handleSubmit(e) {
        e.preventDefault();
        let form = this.props.form;
        this.props.resetStatus();
        if (form.validateFields((err, fields) => {
            if (!err) {
                let _devModule = this._devModuleData.filter((obj) => {
                    return obj.devId === fields.devId && obj.moduleId === fields.moduleId
                })
                Object.assign(fields, { devModuleId: _devModule[0].devModuleId })
                this.props.update(fields);
                this._save = true;
            }

        }));
    }

    handleCancel(e) {

        this._devModuleId = ""
        this._devId = ""
        this._devModuleEnable = "false"
        this._isDefault = "false"
        this._moduleId = "";
        this._save = false;

        let form = this.props.form;
        form.resetFields();

    }

    handleModuleSelect(value, option) {
        if (this._moduleData.length > 0) {
            let _data = this._moduleData.filter((obj) => {
                return obj.moduleId === value
            })
            if (_data.length > 0) {
                this._moduleId = _data[0].moduleId;

            }
        } else {
            this._moduleId = "";
            // this._devModuleEnable = "false"
            // this._isDefault = "false"
        }
        let form = this.props.form;
        form.resetFields();

    }


    handleDevSelect(value, option) {
        const { getFieldValue } = this.props.form;

        let _moduleId = getFieldValue("moduleId")
        let _devModule = this._devModuleData.filter((obj) => {
            return obj.devId === value && obj.moduleId === _moduleId
        })

        if (_devModule.length > 0) {
            this._devModuleEnable = _devModule[0].devModuleEnable.toString();
            this._isDefault = _devModule[0].isDefault.toString();
        } else {
            this._devModuleEnable = "false"
            this._isDefault = "false"
        }
        let form = this.props.form;
        form.resetFields();

    }


    componentWillMount() {
        this.props.loadData();
    }


    componentDidUpdate() {
        if (this._Status === types.UPDATE_SUCCESS && this._save) {
            message.success("Update successfully!")
            this._save = false
            this.props.loadData();

        } else if (this._Status === types.UPDATE_FAILED && this._save) {
            message.error("Update failed!")
            this._save = false
        }
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { moduleData, devData, devModuleData, updateStatus } = this.props;

        this._moduleData = moduleData;
        this._Status = updateStatus;

        this._devModuleData = devModuleData.filter((obj) => {
            return obj.moduleId === this._moduleId;
        })

        const _moduleOptions = moduleData.map((obj, i) =>
            <Select.Option key={i} value={obj.moduleId} >{obj.moduleName}</Select.Option>
        )

        const _devOptons = this._devModuleData.map((objmodule, i) => {
            let _devData = devData.filter((obj) => {
                return obj.devID === objmodule.devId
            })
            return _devData.length === 0 ? null : <Select.Option key={i} value={_devData[0].devID} >{_devData[0].devMacaddress}</Select.Option>
        }
        )


        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };

        return (
            <div className="edulog-container">

                <Row className="row-seprate">
                    <span className="title-medium" >Change Device Module</span>
                </Row>
                <Row >
                    <Form>
                        <Form.Item colon={false} label="Module"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("moduleId", {
                                initialValue: this._moduleId,
                                rules: [{ required: true, message: "Module is required" }]
                            })(
                                <Select size="small" notFoundContent={<Spin size="small"></Spin>} onSelect={this.handleModuleSelect}>
                                    {_moduleOptions}
                                </Select>
                                )}

                        </Form.Item>
                        <Form.Item colon={false} label="Device"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("devId", {
                                initialValue: this._devId,
                                rules: [{ required: true, message: "Device is required" }]
                            })(
                                <Select size="small" notFoundContent={<Spin size="small"></Spin>} onSelect={this.handleDevSelect}>
                                    {_devOptons}
                                </Select>
                                )}

                        </Form.Item>
                        <Form.Item colon={false} label="Enable"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("devModuleEnable", {
                                rules: [{ required: true, message: "Enable is required" }],
                                initialValue: this._devModuleEnable
                            })(
                                <Select size="small"
                                    notFoundContent={<Spin size="small"></Spin>} >
                                    <Select.Option value="true">True</Select.Option>
                                    <Select.Option value="false">False</Select.Option>
                                </Select>

                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Default"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("isDefault", {
                                rules: [{ required: true, message: "Default is required" }],
                                initialValue: this._isDefault
                            })(
                                <Select size="small"
                                    notFoundContent={<Spin size="small"></Spin>} >
                                    <Select.Option value="true">True</Select.Option>
                                    <Select.Option value="false">False</Select.Option>
                                </Select>

                                )}
                        </Form.Item>
                        <Form.Item colon={false} label=" "
                            {...formItemLayout}
                        >
                            <Button type="primary" className="control-seprate" onClick={this.handleSubmit}>Save</Button>
                            <Button type="danger" onClick={this.handleCancel}>Cancel</Button>
                        </Form.Item>

                    </Form>

                </Row>
            </div>
        )
    }
}

class DevModule extends Component {
    constructor(props) {
        super(props);
        this.FormDevice = Form.create()(DeviceModule)
    }
    render() {
        return (
            <this.FormDevice {...this.props} />
        )
    }
}

function mapStateToProps(state, ownProps) {

    let _ModuleData = []
    let _devModuleData = []
    let _devData = []
    let _UpdateStatus = ""

    if (state.DevData.length > 0) {
        _devData = state.DevData[state.DevData.length - 1].data
    }

    if (state.ModuleData.length > 0) {
        _ModuleData = state.ModuleData[state.ModuleData.length - 1].data
    }
    if (state.ModuleUpdate.length > 0) {
        _UpdateStatus = state.ModuleUpdate[state.ModuleUpdate.length - 1].status
    }

    if (state.DevModuleData.length > 0) {
        _devModuleData = state.DevModuleData[state.DevModuleData.length - 1].data
    }
    if (state.DevModuleUpdate.length > 0) {
        _UpdateStatus = state.DevModuleUpdate[state.DevModuleUpdate.length - 1].status
    }


    return {
        devData: _devData,
        moduleData: _ModuleData,
        devModuleData: _devModuleData,
        updateStatus: _UpdateStatus
    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        update: (body) => dispatch(Actions.update_DevModule(body)),
        loadData: () => {
            dispatch(Actions.load_DevModule());
            dispatch(moduleAction.load_Module());
        },
        resetStatus: () => dispatch({ type: types.UPDATE_DEVMODULE, status: "" })

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DevModule)