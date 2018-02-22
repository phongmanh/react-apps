import React, { Component } from 'react'
import { Row, Col, Form, Button, Input, Select, Table, Spin, message, Affix } from 'antd'
import * as Actions from '../../src/actions/devModeAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'
import { InputEditCell, SelectEditCell } from './common/tableCellControl'


class DeviceMode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            render: false,
            disable: false,
        }

        this._Source = []
        this._changeId = []
        this._save = false;
        this._reload = false

        this._devModeData = [];
        this._modeData = [];
        this._Status = ""

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onCellChange = this.onCellChange.bind(this);
    }


    handleSubmit(e) {
        e.preventDefault();
        this.props.resetStatus();

        // Get data row changed
        let _datChenged = this._Source.filter((data) => {
            return this._changeId.indexOf(data.devModeID) > - 1
        })

        if (_datChenged.length > 0) {
            this.props.update(_datChenged);
            this._save = true;
        }
    }

    handleCancel(e) {
        e.preventDefault();
        // Reload data
        this._reload = true
        this.setState({ render: false });
        this._save = false;
    }

    onCellChange(key, dataIndex) {
        return (value) => {
            const target = this._Source.find(item => item.devModeID === key);
            if (target) {
                if (dataIndex === "modeName") {
                    let _mode = this._modeData.find(item => item.modeId === value)
                    if (_mode) {
                        target["modeID"] = value;
                        target[dataIndex] = _mode.modeName;
                    }

                } else {
                    target[dataIndex] = value;
                }
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
            this._changeId = []

        } else if (this._Status === types.UPDATE_FAILED && this._save) {
            message.error("Update failed!")
            this._save = false
        }
    }

    render() {

        const { devModeData, devData, modeData, updateStatus } = this.props;

        this._devModeData = devModeData;
        this._modeData = modeData;
        this._Status = updateStatus;

        const _modeOptions = modeData.map((obj, i) =>
            <Select.Option key={i} value={obj.modeId}>{obj.modeName}</Select.Option>
        )

        const _columns = [
            {
                key: "devMacaddress",
                title: "Device",
                dataIndex: "devMacaddress",
                width: 150
            },
            {
                key: "devSerialnumber",
                title: "Serial Number",
                dataIndex: "devSerialnumber",
                width: 150
            },
            {
                key: "modeName",
                title: "Mode",
                dataIndex: "modeName",
                width: 220,
                render: (text, record, index) => (
                    <span>
                        {
                            <SelectEditCell
                                value={record.modeID}
                                valueText={text}
                                onChange={this.onCellChange(record.devModeID, "modeName")}
                                option={_modeOptions}
                            />
                        }
                    </span>
                )
            }, {
                key: "devBusID",
                title: "Bus",
                dataIndex: "devBusID",
                render: (text, record, index) => (
                    <span>
                        {
                            <InputEditCell
                                value={text}
                                onChange={this.onCellChange(record.devModeID, "devBusID")}
                                disable={record.modeName.includes("Floating") ? true : false} //  If mode = "Permanently Mounted" then required choose bus
                            />
                        }
                    </span>
                )
            }
        ]

        let _dataSource = []
        // Display name
        if (devData.length > 0 && modeData.length > 0 && (this._Source.length === 0 || this._reload)) {
            devModeData.map((d) => {
                let _data = {}
                let _dev = devData.filter((dev) => {
                    return dev.devID === d.devID
                })
                let _mode = modeData.filter((m) => {
                    return m.modeId === d.modeID || m.modeName.trim() === d.modeName.trim()
                })
                if (_dev.length > 0) {
                    Object.assign(_data, d, { devMacaddress: _dev[0].devMacaddress, devSerialnumber: _dev[0].devSerialnumber })// devSerialnumber
                }
                if (_mode.length > 0) {
                    if(d.modeID == null){
                        d.modeID = _mode[0].modeId
                    }
                    Object.assign(_data, d, { modeName: _mode[0].modeName })
                }

                _dataSource.push(_data)
            }
            )
            this._Source = _dataSource;
        } else {
            _dataSource = this._Source
        }

        _dataSource.sort(function (objA, objB) {
            if (objA.devID > objB.devID) return 1;
            if (objA.devID < objB.devID) return -1;
            if (objA.modeName > objB.modeName) return 1;
            if (objA.modeName < objB.modeName) return -1;
            return 0;
        });

        this._reload = false

        return (
            <div className="edulog-container">
                <Row className="row-seprate">
                    <span className="title-medium" >Change Device Mode</span>
                </Row>
                <Row gutter={16}>
                    <Col md={13}>
                        <Table columns={_columns} dataSource={_dataSource} size="small"
                            rowKey="devModeID"
                            pagination={{ pageSize: 20 }}
                            //loading={!_dataSource.length > 0}
                        />
                    </Col >
                    <Col md={11}>
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