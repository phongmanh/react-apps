import React, { Component } from 'react'
import { Row, Col, Form, Button, Input, Select, Spin, message, Table, Popconfirm, Card } from 'antd'
import * as Actions from '../../src/actions/billingActivityAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'


class Billing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: []
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
                if (this._edit) {
                    Object.assign(fields, { id: this._Id })
                    this.props.update(fields);
                } else {
                    this.props.create(fields);
                }
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
        this.props.loadData();
        this.props.loadBill();
    }

    componentDidUpdate() {
        if (this._Status === types.UPDATE_SUCCESS) {
            if (this._save) {
                message.success("Update successfully!")
                this._save = false
                this._edit = false;
                this.props.loadBill();
                this._Status = ""
            } else if (this._delete) {
                message.success("Delete successfully!")
                this._delete = false;
                this.props.loadBill();
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

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { billingData, billingIdData, startData, updateStatus } = this.props

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

        const _billingOptions = billingIdData.map((bill, i) =>
            <Select.Option key={i} value={bill.billingId}>{bill.desc}</Select.Option>
        )

        const _startOptions = startData.map((start, i) =>
            <Select.Option key={i} value={start.startId}>{start.descr}</Select.Option>
        );

        const _columns = [
            {
                key: "billingDescr",
                title: "Billing ID",
                dataIndex: "billingDescr",
            },
            {
                key: "startDescr",
                title: "Start ID",
                dataIndex: "startDescr",
            },
            {
                key: "action",
                title: "",
                render: (text, record) => (
                    <span>
                        {
                            <i> <a onClick={() => this.handleRowEdit(text, record)}>Edit</a> --
                            <Popconfirm title="Are you sure delete this task?" onConfirm={() => this.handleRowConfirmDelete(text, record)} onCancel={this.handleRowCanel} okText="Yes" cancelText="No">
                                    <a>Delete</a>
                                </Popconfirm>
                            </i>

                        }
                    </span>
                )
            }
        ]

        const _dataSource = []
        billingData.map((bill) => {
            let _billDataID = billingIdData.filter((b) => {
                return b.billingId === bill.billingId;
            })
            let _startDataID = startData.filter((s) => {
                return s.startId === bill.startId;
            })
            let _billDescr = ""
            if (_billDataID.length > 0) {
                _billDescr = _billDataID[0].desc;
            }
            let _startDescr = ""
            if (_startDataID.length > 0) {
                _startDescr = _startDataID[0].descr;
            }
            _dataSource.push({ id: bill.id, billingId: bill.billingId, billingDescr: _billDescr, startId: bill.startId, startDescr: _startDescr });
            return null;
        }
        );

        const _rowSelection = {
            onChange: this.selectOnChange,
            selectedRowKeys: this.state.selectedRowKeys
        }

        return (
            <div className="edulog-container">
                <Row className="row-seprate">
                    <span className="title-medium" >Billing Type - Activity Code</span>
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
                            rowKey={(record) => record.id} />
                    </Col>
                    <Col md={12} style={{ border: 2 }}>
                        <Card>
                            <Form>
                                <Form.Item colon={false} label="Billing ID"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator("billingId", {
                                        rules: [{ required: true, message: "Billing ID is required" }]
                                    })(
                                        <Select size="small" //notFoundContent={<Spin size="small"></Spin>}
                                        >
                                            {_billingOptions}
                                        </Select>
                                        )}

                                </Form.Item>
                                <Form.Item colon={false} label="Start ID"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator("startId", {
                                        rules: [{ required: true, message: "Start ID is required" }]
                                    })(
                                        <Select size="small" //notFoundContent={<Spin size="small"></Spin>} 
                                        >
                                            {_startOptions}
                                        </Select>
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


class BillingType extends Component {

    constructor(props) {
        super(props);
        this.BillForm = Form.create()(Billing);
    }

    render() {
        return <this.BillForm {...this.props} />
    }

}

function mapStateToProps(state, ownProps) {
    let _billingData = []
    let _billingID = []
    let _startID = []
    let UpdateStatus = ""

    if (state.BillingData.length > 0) {
        _billingData = state.BillingData[state.BillingData.length - 1].data
    }
    if (state.BillingID.length > 0) {
        _billingID = state.BillingID[state.BillingID.length - 1].data
    }
    if (state.StartID.length > 0) {
        _startID = state.StartID[state.StartID.length - 1].data
    }
    if (state.BillingUpdate.length > 0) {
        UpdateStatus = state.BillingUpdate[state.BillingUpdate.length - 1].status
    }


    return {
        billingData: _billingData,
        billingIdData: _billingID,
        startData: _startID,
        updateStatus: UpdateStatus

    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        update: (body) => dispatch(Actions.update_BillingActivity(body)),
        create: (body) => dispatch(Actions.create_BillingActivity(body)),
        delete: (body) => dispatch(Actions.delete_BillingActivity(body)),
        loadData: () => {
            dispatch(Actions.load_BillingID());
            dispatch(Actions.load_StartID());
        },
        loadBill: () => dispatch(Actions.load_BillingActivity()),
        resetStatus: () => dispatch({ type: types.UPDATE_BILLING_ACTIVITY, status: "" })

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillingType)