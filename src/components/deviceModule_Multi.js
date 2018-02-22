import React, { Component } from 'react'
import { Row, Form, Button, Input, Select, Spin, message, Card, Table, Affix } from 'antd'
import * as Actions from '../../src/actions/devModuleAction'
import * as moduleAction from '../../src/actions/moduleAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'
import { Col } from 'antd/lib/grid';
import { InputEditCell, SelectEditCell } from './common/tableCellControl'

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
        this._reload = false
        this._Source = []
        this._changeId = []
        this._openValue = ["true", "false"]

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }


    handleSubmit(e) {
        e.preventDefault();
        this.props.resetStatus();

        let _datChenged = this._Source.filter((data) => {
            return this._changeId.indexOf(data.devModuleId) > - 1
        })
        this.props.update(_datChenged);
        this._save = true;
    }

    handleCancel(e) {
        this._reload = true;
        this._save = false;
        this.setState({ render: false })
    }


    onCellChange(key, dataIndex) {
        return (value) => {
            const target = this._Source.find(item => item.devModuleId === key);
            if (target) {
                target[dataIndex] = value;
                if (this._changeId.indexOf(key) === -1) {
                    this._changeId.push(key)
                }
                this.setState({ render: false });
            }
        };
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
        const { moduleData, devData, devModuleData, updateStatus } = this.props;

        this._moduleData = moduleData;
        this._Status = updateStatus;


        const _option = this._openValue.map((o, i) =>
            <Select.Option key={i} value={o}>{o}</Select.Option>
        )

        const _columns = [
            {
                key: "devMacaddress",
                title: "Device",
                dataIndex: "devMacaddress",
                width: 150
            }, {
                key: "moduleName",
                title: "Module",
                dataIndex: "moduleName",
                width: 160
            }, {
                key: "isDefault",
                title: "Default",
                dataIndex: "isDefault",
                width : 220,
                render: (text, record, index) => (
                    <span>
                        {
                            <SelectEditCell
                                value={record.isDefault}
                                valueText={text}
                                onChange={this.onCellChange(record.devModuleId, "isDefault")}
                                option={_option}
                            />

                        }
                    </span>
                )
            }, {
                key: "devModuleEnable",
                title: "Enable",
                dataIndex: "devModuleEnable",
                render: (text, record, index) => (
                    <span>
                        {
                            <SelectEditCell
                                value={record.devModuleEnable}
                                valueText={text}
                                onChange={this.onCellChange(record.devModuleId, "devModuleEnable")}
                                option={_option}
                            />
                        }
                    </span>
                )
            },
        ]

        let _dataSource = []
        // Display name
        if (devData.length > 0 && (this._Source.length === 0 || this._reload)) {
            devModuleData.map((d) => {
                let _data = {}
                let _dev = devData.filter((dev) => {
                    return dev.devID === d.devId
                })
                if (_dev.length > 0) {
                    d.isDefault = d.isDefault.toString()
                    d.devModuleEnable = d.devModuleEnable.toString()
                    Object.assign(_data, d, { devMacaddress: _dev[0].devMacaddress, devSerialnumber: _dev[0].devSerialnumber })// devSerialnumber
                }
                _dataSource.push(_data)
            }
            )
            this._Source = _dataSource;
        } else {
            _dataSource = this._Source
        }

        _dataSource.sort(function (objA, objB) {
            if (objA.devId > objB.devId) return 1;
            if (objA.devId < objB.devId) return -1;
            if (objA.moduleName > objB.moduleName) return 1;
            if (objA.moduleName < objB.moduleName) return -1;
            return 0;
        });
        
        this._reload = false

        return (
            <div className="edulog-container">

                <Row className="row-seprate">
                    <span className="title-medium" >Change Device Module</span>
                </Row>
                <Row gutter={16}>
                    <Col md={14}>
                        <Table columns={_columns} dataSource={_dataSource} size="small"
                            rowKey="devModuleId"
                            pagination={{ pageSize: 20 }}
                            //loading={!_dataSource.length > 0}
                        />
                    </Col >
                    <Col md={5}>
                        <Affix offsetTop={120}>
                            <Button type="primary" className="control-seprate" onClick={this.handleSubmit}>Save</Button>
                            <Button type="danger" onClick={this.handleCancel}>Cancel</Button>
                        </Affix>,
                    </Col>

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