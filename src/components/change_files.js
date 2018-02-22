import React, { Component } from 'react'
import { Row, Form, Button, Input, Select, Spin, message, Modal } from 'antd'
import * as Actions from '../../src/actions/filesActions'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'


class SetURL extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
            showModal: false
        }

        this._save = false;
        this._filesData = [];

        this._fileId = "";
        this._url = "";
        this._version = "";
        this._fileType = "";
        this._save = false;
        this._Status = "";

        this.handleModuleSelect = this.handleModuleSelect.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);


        this.showModal = this.showModal.bind(this);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
        this.handleModalReset = this.handleModalReset.bind(this);

    }


    handleSubmit(e) {
        e.preventDefault();
        let form = this.props.form;
        this.props.resetStatus();
        if (form.validateFields(["fileId", "version", "url"],(err, fields) => {
            if (!err) {
                Object.assign(fields, { fileType: this._fileType })
                this.props.update(fields);
                this._save = true;
            }

        }));
    }

    handleCancel(e) {

        this._fileId = "";
        this._url = "";
        this._version = "";
        this._fileType = "";
        this._save = false;

        let form = this.props.form;
        form.resetFields();

    }

    handleModuleSelect(value, option) {
        if (this._filesData.length > 0) {
            let _data = this._filesData.filter((obj) => {
                return obj.fileId === value
            })

            if (_data.length > 0) {
                this._fileId = _data[0].fileId;
                this._url = _data[0].url;
                this._version = _data[0].version;
                this._fileType = _data[0].fileType;
            }
        } else {

            this._fileId = "";
            this._url = "";
            this._version = "";
            this._fileType = "";
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

        if (form.validateFields(["_fileType", "_version", "_url"], (err, fields) => {
            if (!err) {
                let values = Object.assign({}, {
                    fileType: fields._fileType, version: fields._version
                    , url: fields._url
                })
                this.props.create(values);
                this._save = true;
            }
        }));
    }

    handleModalReset(e) {
        e.preventDefault();
        let form = this.props.form;
        form.resetFields(["_fileType", "_version", "_url"]);
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
        const { getFieldDecorator } = this.props.form;
        const { filesData, updateStatus } = this.props;

        this._filesData = filesData;
        this._Status = updateStatus;

        const _filesOptions = filesData.map((obj, i) =>
            <Select.Option key={i} value={obj.fileId} >{obj.fileType}</Select.Option>
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
                    <span className="title-medium" >Change Files</span>
                </Row>
                <Row >
                    <Form>
                        <Form.Item colon={false} label="Types"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("fileId", {
                                initialValue: this._fileId,
                                rules: [{ required: true, message: "Types is required" }]
                            })(
                                <Select size="small" //notFoundContent={<Spin size="small"></Spin>} 
                                onSelect={this.handleModuleSelect}>
                                    {_filesOptions}
                                </Select>
                                )}

                        </Form.Item>
                        <Form.Item colon={false} label="Version"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("version", {
                                initialValue: this._version,

                            })(
                                <Input size="small" disabled />
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Url"
                            {...formItemLayout}
                        >
                            {getFieldDecorator("url", {
                                rules: [{ required: true, message: "Url is required" }],
                                initialValue: this._url
                            })(
                                <Input size="small" />
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
                    <Modal title="Add new" visible={this.state.showModal}
                        footer={<span>
                            <Button type="primary" className="control-seprate" onClick={this.handleModalOk}>Save</Button>
                            <Button type="danger" onClick={this.handleModalReset}>Cancel</Button>
                        </span>}
                        //onOk={this.handleModalOk} 
                        onCancel={this.handleModalCancel}>
                        <Form.Item colon={false} label="Type"
                            {...formItemLayout_modal}
                        >
                            {getFieldDecorator("_fileType", {
                                rules: [{ required: true, message: "Type name is required" }]
                            })(
                                <Input size="small" />
                                )}
                        </Form.Item>
                        <Form.Item colon={false} label="Version"
                            {...formItemLayout_modal}
                        >
                            {getFieldDecorator("_version", {
                            })(
                                <Input size="small" />
                                )}
                        </Form.Item>

                        <Form.Item colon={false} label="Url"
                            {...formItemLayout_modal}
                        >
                            {getFieldDecorator("_url", {
                                rules: [{ required: true, message: "Url is required" }]
                            })(
                                <Input size="small" />
                                )}
                        </Form.Item>
                        
                    </Modal>
                </Row>
            </div>
        )
    }
}

class Files extends Component {
    constructor(props) {
        super(props);
        this.FormDevice = Form.create()(SetURL)
    }
    render() {
        return (
            <this.FormDevice {...this.props} />
        )
    }
}

function mapStateToProps(state, ownProps) {

    let _FilesData = []
    let _UpdateStatus = ""

    if (state.FilesData.length > 0) {
        _FilesData = state.FilesData[state.FilesData.length - 1].data
    }
    if (state.FilesUpdate.length > 0) {
        _UpdateStatus = state.FilesUpdate[state.FilesUpdate.length - 1].status
    }


    return {
        filesData: _FilesData,
        updateStatus: _UpdateStatus
    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        update: (body) => dispatch(Actions.update_Files(body)),
        create: (body) => dispatch(Actions.create_Files(body)),
        loadData: () => dispatch(Actions.load_Files()),
        resetStatus: () => dispatch({ type: types.UPDATE_FILES, status: "" })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Files)