import React, { Component } from 'react'
import { Row, Form, Button, Input, Select, Dropdown, Spin, message, Modal } from 'antd'
import * as Actions from '../../src/actions/sysSettingAction'
import { load_Setting } from '../../src/actions/sysSettingAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'

class SystemSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            render: false,
            showModal: false
        }

        this._settingData = []
        this._devSettingData = []
        this._appID = 1;
        this._settingId = ""
        this._settingName = "";
        this._settingDescr = ""
        this._settingValue = "";
        this._settingType = "";
        this._save = false;
        this._Status = ""

        this._openValue = ["ON", "OFF"]
        this._openID = ["AUDIO_IN_MOTION", "VIDEO_IN_MOTION", "KIOSK_MODE", "AUTOSWIPECARDSATSCHOOL"]
        this._display = ["IMPERIAL", "UNIT"]
        this._displayID = ["DISPLAY_UNITS"]


        this.handSettingNameSelect = this.handSettingNameSelect.bind(this);

        this.showModal = this.showModal.bind(this);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
        this.handleModalReset = this.handleModalReset.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }


    handleSubmit(e) {
        e.preventDefault();
        let form = this.props.form;
        this.props.resetStatus();

        if (form.validateFields(["settingValue", "settingName", "appID", "settingType", "settingDescription"], (err, fields) => {
            if (!err) {
                Object.assign(fields, { appID: 1, settingId: this._settingId })
                this.props.update([fields]);
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

    handSettingNameSelect(value, option) {
        if (this._settingData.length > 0) {
            let data = this._settingData.filter((obj) => {
                return obj.settingName.trim() === value.trim()
            })

            if (data.length > 0) {
                this._appID = data[0].appID;
                this._settingId = data[0].settingId;
                this._settingName = data[0].settingName;
                this._settingDescr = data[0].settingDescription
                this._settingValue = data[0].settingValue;
                this._settingType = data[0].settingType;
            }
        } else {
            this._appID = "1";
            this._settingId = "";
            this._settingName = "";
            this._settingDescr = "";
            this._settingValue = "";
            this._settingType = "";
        }

        let form = this.props.form;
        form.resetFields();

    }

    showModal() {
        this.setState({
            showModal: true
        })
    }

    handleModalCancel(e) {
        this.setState({
            showModal: false
        })
    }

    handleModalOk(e) {
        e.preventDefault();
        let form = this.props.form;
        this.props.resetStatus();

        if (form.validateFields(["_settingValue", "_settingName", "_settingType", "_settingDescription"], (err, fields) => {
            if (!err) {
                let values = Object.assign({}, {
                    settingName: fields._settingName, settingValue: fields._settingValue
                    , settingDescription: fields._settingDescription, settingType: fields._settingType
                    , appID: this._appID
                })
                this.props.create([values]);
                this._save = true;
            }
        }));
    }

    handleModalReset(e) {
        e.preventDefault();
        let form = this.props.form;
        form.resetFields(["_settingValue", "_settingName", "_settingType", "_settingDescription"]);
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
        const { appData, settingData, devSettingData, updateStatus } = this.props;

        this._settingData = settingData;
        this._devSettingData = devSettingData;
        this._Status = updateStatus;


        const _appOptions = appData.map((obj, i) =>
            <Select.Option key={i} value={obj.appID}>{obj.appName}</Select.Option>
        )

        const _settingOptions = settingData.map((obj, i) =>
            <Select.Option key={i} value={obj.settingName}>{obj.settingName}</Select.Option>
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
        const formItemLayout_modal = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };

        return (
            <div className="edulog-container">
                <Row className="row-seprate">
                    <span className="title-medium" >Change System Setting Value</span>
                </Row>
                <Row >
                    <Form id="main">
                        <Form.Item colon={false} label="Setting Name"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("settingName", {
                                initialValue: this._settingName,
                                rules: [{ required: true, message: "Setting name is required" }]
                            })(
                                <Select size="small" onSelect={this.handSettingNameSelect}>
                                    {_settingOptions}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Setting Description"
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
                        <Form.Item colon={false} label=" "
                            {...formItemLayout}
                        >
                            <Button type="primary" className="control-seprate" onClick={this.handleSubmit}>Save</Button>
                            <Button type="dashed" className="control-seprate" onClick={this.showModal}>Add New</Button>
                            <Button type="danger" onClick={this.handleCancel}>Cancel</Button>
                        </Form.Item>
                    </Form>
                    <Modal title="Add new system setting" visible={this.state.showModal}
                        footer={<span>
                            <Button type="primary" className="control-seprate" onClick={this.handleModalOk}>Save</Button>
                            <Button type="danger" onClick={this.handleModalReset}>Cancel</Button>
                        </span>}
                        //onOk={this.handleModalOk} 
                        onCancel={this.handleModalCancel}>
                        <Form.Item colon={false} label="Setting Name"
                            {...formItemLayout_modal}
                        >
                            {getFieldDecorator("_settingName", {
                                rules: [{ required: true, message: "Setting name is required" }]
                            })(
                                <Input size="small" />
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Setting Description"
                            {...formItemLayout_modal}
                        >
                            {getFieldDecorator("_settingDescription", {
                            })(
                                <Input size="small" />
                                )}
                        </Form.Item>

                        <Form.Item colon={false} label="Setting Value"
                            {...formItemLayout_modal}
                        >
                            {getFieldDecorator("_settingValue", {
                                rules: [{ required: true, message: "Setting value is required" }]
                            })(
                                <Input size="small" />
                                )}
                        </Form.Item>

                        <Form.Item colon={false} label="Setting Type"
                            {...formItemLayout_modal}
                        >
                            {getFieldDecorator("_settingType", {
                                rules: [{ required: true, message: "Setting type is required" }],
                            })(
                                <Select size="small" className="modal-control-style">
                                    <Select.Option value="ALL" >All</Select.Option>
                                    <Select.Option value="DEVICE" >Device</Select.Option>
                                </Select>
                                )}
                        </Form.Item>
                    </Modal>
                </Row>
            </div>
        )
    }
}

class System extends Component {
    constructor(props) {
        super(props);
        this.FormDevice = Form.create()(SystemSetting)
    }
    render() {
        return (
            <this.FormDevice {...this.props} />
        )
    }
}

function mapStateToProps(state, ownProps) {
    let AppData = []
    let SettingData = []
    let DevSettingData = []
    let UpdateStatus = ""

    if (state.AppData.length > 0) {
        AppData = state.AppData[state.AppData.length - 1].data
    }

    if (state.SettingData.length > 0) {
        SettingData = state.SettingData[state.SettingData.length - 1].data
    }
    if (state.DevSettingData.length > 0) {
        DevSettingData = state.DevSettingData[state.DevSettingData.length - 1].data
    }
    if (state.SysSettingUpdate.length > 0) {
        UpdateStatus = state.SysSettingUpdate[state.SysSettingUpdate.length - 1].status
    }


    return {
        appData: AppData,
        settingData: SettingData,
        devSettingData: DevSettingData,
        updateStatus: UpdateStatus
    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        update: (body) => dispatch(Actions.update_SysSetting(body)),
        create: (body) => dispatch(Actions.create_SysSetting(body)),
        resetStatus: () => dispatch({ type: types.UPDATE_SYSSETTING, status: "" }),
        loadData: () => dispatch(load_Setting())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(System)