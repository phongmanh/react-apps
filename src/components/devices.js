import React, { Component } from 'react'
import { Row, Col, Form, Button, Input, Select, Spin, message, Table, Popconfirm, Card } from 'antd'
import * as Actions from '../../src/actions/deviceAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'


class Device extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            loading: true,
        }

        this._updateStatus = ""
        this._save = false;
        this._delete = false;
        this._edit = false;
        this._Id = ""

        this.handleRowEdit = this.handleRowEdit.bind(this);
        this.handleRowConfirmDelete = this.handleRowConfirmDelete.bind(this);
        this.handleRowCanel = this.handleRowCanel.bind(this);
        this.handleFormCancel = this.handleFormCancel.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.pagingOnChange = this.pagingOnChange.bind(this);
    }


    pagingOnChange(page, pageSize) {

    }

    handleFormCancel(e) {
        e.preventDefault();
        let form = this.props.form;
        form.resetFields();

        this._save = false;
        this._delete = false;
        this._edit = false;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.props.resetStatus();
        let form = this.props.form;
        if (form.validateFields((err, fields) => {
            if (!err) {
                this.props.create(fields);
                this._save = true;
            }
        }));
    }

    handleRowEdit(text, record) {
        const { setFieldsValue, setFields } = this.props.form;
        setFieldsValue({ billingId: record.billingId, startId: record.startId });
        this._Id = record.id;
        this._edit = true

    }

    handleRowConfirmDelete(text, record) {
        this.props.resetStatus();
        this.props.delete(record);
        this._delete = true;
    }

    handleRowCanel() {
        this._save = false;
        this._delete = false;
        this._edit = false;
    }

    componentDidMount() {
        this.props.load_Devices();
    }

    componentDidUpdate() {
        if (this._Status === types.UPDATE_SUCCESS) {
            if (this._save) {
                message.success("Update successfully!")
                this._save = false
                this._edit = false;
                this.props.load_Devices();
                this._Status = ""
            } else if (this._delete) {
                message.success("Delete successfully!")
                this._delete = false;
                this.props.load_Devices();
                this._Status = ""
            }
        } else if (this._Status === types.UPDATE_FAILED) {
            if (this._save) {
                message.error("Update failed!")
                this._save = false;
                this._edit = false;
                this._Status = ""
            } else if (this._delete) {
                message.error("Delete failed!")
                this._delete = false;
                this._Status = ""
            }
        }
    }

    com

    render() {

        const { getFieldDecorator } = this.props.form;
        const { deviceData, updateStatus } = this.props

        this._Status = updateStatus;

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
        const _columns = [
            {
                key: "devMacaddress",
                title: "Mac Address",
                dataIndex: "devMacaddress",
            },
            {
                key: "devSerialnumber",
                title: "Serial Number",
                dataIndex: "devSerialnumber",
            },
            {
                key: "action",
                title: "",
                render: (text, record) => (
                    <span>
                        {
                            <i>
                                {/* <a onClick={() => this.handleRowEdit(text, record)}>Edit</a> -- */}
                                <Popconfirm title="Are you sure delete this task?" onConfirm={() => this.handleRowConfirmDelete(text, record)} onCancel={this.handleRowCanel} okText="Yes" cancelText="No">
                                    <a>Delete</a>
                                </Popconfirm>
                            </i>

                        }
                    </span>
                )
            }
        ]

        const _dataSource = deviceData

        const _rowSelection = {
            onChange: this.selectOnChange,
            selectedRowKeys: this.state.selectedRowKeys
        }

        return (
            <div className="edulog-container">
                <Row className="row-seprate">
                    <span className="title-medium" >Devices</span>
                </Row>
                <Row gutter={16} id="edulog">
                    <Col md={12}>
                        <Table columns={_columns} dataSource={_dataSource} //rowSelection={_rowSelection}
                            size="small"
                            rowClassName={(record, index) => index % 2 === 0 ? "row-background-first" : "row-background-second"}
                            bordered={false} pagination={{
                                pageSize: 10
                                , defaultCurrent: 1
                                , onChange: this.pagingOnChange,
                            }}
                            rowKey={(record) => record.devMacaddress}
                        //loading={this.state.loading}
                        />
                    </Col>
                    <Col md={12} style={{ border: 2 }}>
                        <Card>
                            <Form>
                                <Form.Item colon={false} label="Mac Address"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator("devMacaddress", {
                                        rules: [{ required: true, message: "Mac address is required" }]
                                    })(
                                        <Input size="small" />
                                        )
                                    }
                                </Form.Item>
                                <Form.Item colon={false} label="Serial Number"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator("devSerialnumber", {
                                        rules: [{ required: true, message: "Serial number is required" }]
                                    })(
                                        <Input size="small" />
                                        )}
                                </Form.Item>
                                <Form.Item colon={false} label=" "
                                    {...formItemLayout}
                                >
                                    <Button type="primary" className="control-seprate" onClick={this.handleFormSubmit}>Save</Button>
                                    <Button type="danger" onClick={this.handleFormCancel}>Cancel</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                </Row>
            </div>
        )
    }
}


class Devices extends Component {

    constructor(props) {
        super(props);
        this.DeviceForm = Form.create()(Device);
    }

    render() {
        return <this.DeviceForm {...this.props} />
    }

}

function mapStateToProps(state, ownProps) {
    let _deviceData = []
    let _updateStatus = ""

    if (state.DevData.length > 0) {
        _deviceData = state.DevData[state.DevData.length - 1].data
    }
    if (state.DevUpdate.length > 0) {
        _updateStatus = state.DevUpdate[state.DevUpdate.length - 1].status
    }


    return {
        deviceData: _deviceData,
        updateStatus: _updateStatus

    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        create: (body) => dispatch(Actions.create_Device(body)),
        delete: (body) => dispatch(Actions.delete_Device(body)),
        load_Devices: () => dispatch(Actions.load_Devices()),
        resetStatus: () => dispatch({ type: types.UPDATE_DEV, status: "" })

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Devices)