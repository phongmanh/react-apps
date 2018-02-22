import React, { Component } from 'react'
import { Row, Form, Button, Input, Select, Dropdown, Spin, message } from 'antd'
import * as Actions from '../../src/actions/devModeAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'


class DeviceMode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            render: false
        }

        this._save = false;
        this._devBusRequired = false;

        this._devModeData = [];
        this._modeData = [];

        this._devModeID = "";
        this._devID = "";
        this._modeID = "";
        this._devBusID = "";
        this._Status = ""

        this.handleDevSelect = this.handleDevSelect.bind(this);
        this.handleModeSelect = this.handleModeSelect.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }


    handleSubmit(e) {
        e.preventDefault();
        let form = this.props.form;
        this.props.resetStatus();
        if (form.validateFields((err, fields) => {
            if (!err) {
                let _data = this._devModeData.filter((obj) => {
                    return obj.devID === fields.devID && obj.modeID === fields.modeID;
                })
                if (_data.length > 0) {
                    let _devModeID = _data[0].devModeID;
                    Object.assign(fields, { devModeID: _devModeID })
                    this.props.update(fields);
                    this._save = true;
                }
            }
        }));
    }

    handleCancel(e) {
        e.preventDefault();
        this._devModeID = "";
        this._devID = "";
        this._modeID = "";
        this._devBusID = "";
        this._save = false;

        let form = this.props.form;
        form.resetFields();

    }

    handleDevSelect(value, option) {
        let form = this.props.form;
        form.resetFields();
    }

    handleModeSelect(value, option) {
        if (this._modeData.length > 0) {
            let data = this._modeData.filter((obj) => {
                return obj.modeId === value;
            })
            if (data.length > 0) {
                if (data[0].modeName.includes("Permanently")) {
                    this._devBusRequired = true;
                }
                else {
                    this._devBusRequired = false;
                }
            }
        }

    }

    componentWillMount() {
        this.props.loadData();
    }

    componentDidUpdate() {
        if (this._Status === types.UPDATE_SUCCESS && this._save) {
            message.success("Update successfully!")
            this._save = false

        } else if (this._Status === types.UPDATE_FAILED && this._save) {
            message.error("Update failed!")
            this._save = false
        }
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { devModeData, devData, modeData, updateStatus } = this.props;

        this._devModeData = devModeData;
        this._modeData = modeData;
        this._Status = updateStatus;

        // const _devModeOptions = devModeData.map((obj, i) =>
        //     <Select.Option key={i} value={obj.devModeID}>{obj.devModeID}</Select.Option>
        // )

        let _modeData = devModeData.filter((obj) => {
            return obj.devID === getFieldValue("devID");
        })

        const _modeOptions = _modeData.map((obj, i) =>
            <Select.Option key={i} value={obj.modeID}>{obj.modeName}</Select.Option>
        )

        const _devOptions = devData.map((obj, i) =>
            <Select.Option key={i} value={obj.devID} >{obj.devMacaddress}</Select.Option>
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
                    <span className="title-medium" >Change Device Mode</span>
                </Row>
                <Row >
                    <Form>
                        <Form.Item colon={false} label="Device"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("devID", {
                                initialValue: this._devID,
                                rules: [{ required: true, message: "Device is required" }]
                            })(
                                <Select size="small" notFoundContent={<Spin size="small"></Spin>} onSelect={this.handleDevSelect}>
                                    {_devOptions}
                                </Select>
                                )}

                        </Form.Item>
                        <Form.Item colon={false} label="Mode"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("modeID", {
                                initialValue: this._modeID,
                                rules: [{ required: true, message: "Mode is required" }]
                            })(
                                <Select size="small"
                                    notFoundContent={<Spin size="small"></Spin>} onSelect={this.handleModeSelect}>
                                    {_modeOptions}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Device Bus"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("devBusID", {
                                rules: [{ required: this._devBusRequired, message: "Device Bus is required" }],
                                initialValue: this._devBusID
                            })(
                                <Input size="small" disabled={!this._devBusRequired} />
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

class DevMode extends Component {
    constructor(props) {
        super(props);
        this.FormDevice = Form.create()(DeviceMode)
    }
    render() {
        return (
            <this.FormDevice {...this.props} />
        )
    }
}

function mapStateToProps(state, ownProps) {

    let DevData = []
    let DevModeData = []
    let ModeData = []

    let UpdateStatus = ""

    if (state.DevModeData.length > 0) {
        DevModeData = state.DevModeData[state.DevModeData.length - 1].data
    }

    if (state.ModeData.length > 0) {
        ModeData = state.ModeData[state.ModeData.length - 1].data
    }
    if (state.DevData.length > 0) {
        DevData = state.DevData[state.DevData.length - 1].data
    }
    if (state.DevModeUpdate.length > 0) {
        UpdateStatus = state.DevModeUpdate[state.DevModeUpdate.length - 1].status
    }


    return {
        devData: DevData,
        devModeData: DevModeData,
        modeData: ModeData,
        updateStatus: UpdateStatus
    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        update: (body) => dispatch(Actions.update_devMode(body)),
        loadData: () => {
            dispatch(Actions.load_Mode());
            dispatch(Actions.load_devMode());
        },
        resetStatus: () => dispatch({ type: types.UPDATE_DEVMODE, status: "" })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DevMode)