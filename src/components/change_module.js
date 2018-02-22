import React, { Component } from 'react'
import { Row, Form, Button, Input, Select, Spin, message } from 'antd'
import * as Actions from '../../src/actions/moduleAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'


class ChangeModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false
        }

        this._save = false;
        this._moduleData = [];
        this._Status = "";

        this._moduleId = "";
        this._appID = 1;
        this._moduleName = "";
        this._moduleDescr = "";
        this._moduleEnable = "false";


        this.handleModuleSelect = this.handleModuleSelect.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }


    handleSubmit(e) {
        e.preventDefault();
        let form = this.props.form;
        this.props.resetStatus();
        if (form.validateFields((err, fields) => {
            if (!err) {
                Object.assign(fields, {moduleName : this._moduleName, appID : this._appID })
                this.props.update(fields);
                this._save = true;
            }

        }));
    }

    handleCancel(e) {

        this._moduleId = "";
        this._appID = 1;
        this._moduleName = "";
        this._moduleDescr = "";
        this._moduleEnable = "false";
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
                this._moduleId = _data[0].devModeID;
                this._moduleName = _data[0].moduleName;
                this._moduleDescr = _data[0].moduleDescription;
                this._moduleEnable = _data[0].moduleEnable.toString();
            }
        } else {
            this._moduleId = "";
            this._appID = 1;
            this._moduleName = "";
            this._moduleDescr = "";
            this._moduleEnable = "false";
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
        const { moduleData, updateStatus } = this.props;

        this._moduleData = moduleData;
        this._Status = updateStatus;

        const _moduleOptions = moduleData.map((obj, i) =>
            <Select.Option key={i} value={obj.moduleId} >{obj.moduleName}</Select.Option>
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
                    <span className="title-medium" >Change Modules</span>
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
                                <Select size="small" //notFoundContent={<Spin size="small"></Spin>} 
                                onSelect={this.handleModuleSelect}>
                                    {_moduleOptions}
                                </Select>
                                )}

                        </Form.Item>
                        <Form.Item colon={false} label="Description"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("moduleDescription", {
                                initialValue: this._moduleDescr,

                            })(
                                <Input size="small" disabled />
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Enable"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("moduleEnable", {
                                rules: [{ required: true, message: "Enable is required" }],
                                initialValue: this._moduleEnable
                            })(
                                <Select size="small"
                                    //notFoundContent={<Spin size="small"></Spin>} 
                                    >
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

class Module extends Component {
    constructor(props) {
        super(props);
        this.FormDevice = Form.create()(ChangeModule)
    }
    render() {
        return (
            <this.FormDevice {...this.props} />
        )
    }
}

function mapStateToProps(state, ownProps) {

    let _ModuleData = []
    let _UpdateStatus = ""

    if (state.ModuleData.length > 0) {
        _ModuleData = state.ModuleData[state.ModuleData.length - 1].data
    }
    if (state.ModuleUpdate.length > 0) {
        _UpdateStatus = state.ModuleUpdate[state.ModuleUpdate.length - 1].status
    }


    return {
        moduleData: _ModuleData,
        updateStatus: _UpdateStatus
    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        update: (body) => dispatch(Actions.update_Module(body)),
        loadData: () => {
            dispatch(Actions.load_Module());
        },
        resetStatus: () => dispatch({ type: types.UPDATE_MODULE, status: "" })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Module)