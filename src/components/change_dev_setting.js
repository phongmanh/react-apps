
import React, { Component } from 'react'
import { Row, Col, Form, Button, InputNumber, Input, Select, Dropdown, Spin, message } from 'antd'
import * as Actions from '../../src/actions/devSettingAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'

class DeviceSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            render: false
        }

        this._settingData = []
        this._devSettingData = []
        this._appID = 1;
        this._devID = "";
        this._settingName = "";
        this._settingDescr = ""
        this._settingValue = "";
        this._settingType = "";
        this._devMacaddress = ""
        this._save = false;
        this._Status = ""
        this._devSettingId = null

        this._openValue = ["ON", "OFF"]
        this._openID = ["KIOSK_MODE"]
        this._display = ["IMPERIAL", "UNIT"]
        this._displayID = ["DISPLAY_UNITS"]

        this.handSettingSelect = this.handSettingSelect.bind(this);
        this.handDeviceSelect = this.handDeviceSelect.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }


    handleSubmit(e) {
        e.preventDefault();
        let form = this.props.form;
        this.props.resetStatus();
        if (form.validateFields((err, fields) => {
            if (!err) {
                Object.assign(fields, { appID: "1", settingName: this._settingName })
                this.props.update(fields);
                this._save = true;
            }
        }));
    }

    handleCancel(e) {
        this._appID = 1;
        this._devID = "";
        this._settingName = "";
        this._settingDescr = ""
        this._settingValue = "";
        this._settingType = "";
        this._devMacaddress = ""
        this._save = false;

        let form = this.props.form;
        form.resetFields();

    }

    handSettingSelect(value, option) {
        if (this._devSettingData.length > 0) {
            let data = this._devSettingData.filter((obj) => {
                return obj.devSettingId === value
            })

            if (data.length > 0) {
                this._appID = data[0].appID;
                this._devID = data[0].devID;
                this._settingName = data[0].settingName;
                this._settingDescr = data[0].settingDescription
                this._settingValue = data[0].settingValue;
                this._settingType = data[0].settingType;
            }
        } else {
            this._appID = "1";
            this._devID = "";
            this._settingName = "";
            this._settingDescr = ""
            this._settingValue = "";
            this._settingType = "";
        }
        let form = this.props.form;
        form.resetFields();
    }

    handDeviceSelect(value, option) {
        this._devID = value;
        this._devMacaddress = option.props.children;
        this._settingName = "";
        this._settingDescr = ""
        this._settingValue = "";
        this._settingType = "";

        let form = this.props.form;
        form.resetFields();
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
        const { getFieldDecorator } = this.props.form;
        const { appData, devData, settingData, devSettingData, updateStatus } = this.props;

        this._settingData = settingData;
        this._devSettingData = devSettingData;
        this._Status = updateStatus;

        const _appOptions = appData.map((obj, i) =>
            <Select.Option key={i} value={obj.appID}>{obj.appName}</Select.Option>
        )

        const _devOptions = devData.map((obj, i) =>
            <Select.Option key={i} value={obj.devID} >{obj.devMacaddress}</Select.Option>
        )

        let _settingValueCtrl = null;
        if (this._openID.indexOf(this._settingName) > -1) {
            _settingValueCtrl =
                <Select>
                    {
                        this._openValue.map((value, i) =>
                            <Select.Option key={i} value={value} >{value}</Select.Option>
                        )
                    }
                </Select >

        } else if (this._displayID.indexOf(this._settingName) > -1) {
            _settingValueCtrl =
                <Select>
                    {
                        this._display.map((value, i) =>
                            <Select.Option key={i} value={value} >{value}</Select.Option>
                        )
                    }
                </Select >
        }
        else {
            _settingValueCtrl = <Input size="small" />
        }

        let _devSettingData = devSettingData.filter((obj) => {
            return obj.devID === this._devID && obj.appID === this._appID
        })

        const _devSettingOptions = _devSettingData.map((obj, i) =>
            <Select.Option key={i} value={obj.devSettingId}>{obj.settingName}</Select.Option>
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
                    <span className="title-medium" >Change Device Setting Value</span>
                </Row>
                <Row >
                    <Form>
                        {/* <Form.Item colon={false} label="App ID"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("appID", {
                                initialValue: this._appID
                            })(
                                <Select size="small" disabled>
                                    {_appOptions}
                                </Select>
                                )}
                        </Form.Item> */}
                        <Form.Item colon={false} label="Device"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("devID", {
                                initialValue: this._devID,
                                rules: [{ required: true, message: "Device ID is required" }]
                            })(
                                <Select size="small" onSelect={this.handDeviceSelect}
                                    notFoundContent={<Spin size="small"></Spin>}
                                >
                                    {_devOptions}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Setting Name"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("devSettingId", {
                                initialValue: this._devSettingId,
                                rules: [{ required: true, message: "Setting ID is required" }]
                            })(
                                <Select size="small" onSelect={this.handSettingSelect}
                                    notFoundContent={<Spin size="small"></Spin>}>
                                    {_devSettingOptions}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Description"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("settingDescription", {
                                initialValue: this._settingDescr
                            })(
                                <Input size="small" disabled />
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Setting Value"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("settingValue", {
                                rules: [{ required: true, message: "Setting value is required" }],
                                initialValue: this._settingValue
                            })(
                                _settingValueCtrl
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Setting Type"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("settingType", {
                                initialValue: this._settingType,
                            })(
                                <Select size="small" disabled>
                                    <Select.Option value="All" >All</Select.Option>
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

class Device extends Component {
    constructor(props) {
        super(props);
        this.FormDevice = Form.create()(DeviceSetting)
    }
    render() {
        return (
            <this.FormDevice {...this.props} />
        )
    }
}

function mapStateToProps(state, ownProps) {
    let AppData = []
    let DevData = []
    let SettingData = []
    let DevSettingData = []
    let UpdateStatus = ""

    if (state.AppData.length > 0) {
        AppData = state.AppData[state.AppData.length - 1].data
    }
    if (state.DevData.length > 0) {
        DevData = state.DevData[state.DevData.length - 1].data
    }

    if (state.SettingData.length > 0) {
        SettingData = state.SettingData[state.SettingData.length - 1].data
    }
    if (state.DevSettingData.length > 0) {
        DevSettingData = state.DevSettingData[state.DevSettingData.length - 1].data
    }
    if (state.DevSettingUpdate.length > 0) {
        UpdateStatus = state.DevSettingUpdate[state.DevSettingUpdate.length - 1].status
    }


    return {
        appData: AppData,
        devData: DevData,
        settingData: SettingData,
        devSettingData: DevSettingData,
        updateStatus: UpdateStatus
    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        update: (body) => dispatch(Actions.update_DevSetting(body)),
        resetStatus: () => dispatch({ type: types.UPDATE_DEVSETTING, status: "" }),
        loadData: () => dispatch(Actions.load_DevSetting())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Device)