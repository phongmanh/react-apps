
import React, { Component } from 'react'
import { Row, Col, Form, Button, InputNumber, Input, Select, Dropdown, Spin, message, Table, Affix } from 'antd'
import * as Actions from '../../src/actions/devSettingAction'
import * as types from '../../src/actions/actionTypes'
import { connect } from 'react-redux'
import { InputEditCell, SelectEditCell } from './common/tableCellControl'

class DeviceSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            render: false
        }

        this._settingData = []
        this._devSettingData = []
        this._Source = []
        this._changeId = []
        this._reload = false

        this._save = false;
        this._Status = ""

        this._openValue = ["ON", "OFF"]
        this._openID = ["KIOSK_MODE"]
        this._display = ["IMPERIAL", "UNIT"]
        this._displayID = ["DISPLAY_UNITS"]

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }


    handleSubmit(e) {
        e.preventDefault();

        this.props.resetStatus();
        // Get data row changed
        let _datChenged = this._Source.filter((data) => {
            return this._changeId.indexOf(data.devSettingId) > - 1
        })
        this.props.update(_datChenged);
        this._save = true;
    }

    handleCancel(e) {
        this._save = false;
        this._reload = true;
        this.setState({ render: false })
    }

    onCellChange(key, dataIndex) {
        return (value) => {
            const target = this._Source.find(item => item.devSettingId === key);
            if (target) {
                target[dataIndex] = value;
                if (this._changeId.indexOf(key) === -1) {
                    this._changeId.push(key)
                }
                this.setState({ render: false });
            }
        };
    }

    generateOption(text) {
        let _option = null
        if (this._openID.indexOf(text) > -1) {
            _option =
                this._openValue.map((value, i) =>
                    <Select.Option key={i} value={value} >{value}</Select.Option>
                )
        } else if (this._displayID.indexOf(text) > -1) {
            _option =
                this._display.map((value, i) =>
                    <Select.Option key={i} value={value} >{value}</Select.Option>
                )
        }
        return _option
    }

    componentDidUpdate() {
        if (this._Status === types.UPDATE_SUCCESS && this._save) {
            message.success("Update successfully!")
            this._save = false
            this._changeId = []
            this.props.loadData();
        } else if (this._Status === types.UPDATE_FAILED && this._save) {
            message.error("Update failed!")
            this._save = false
        }
    }

    componentWillMount() {
        this.props.loadData();
    }


    render() {
        const { devData, settingData, devSettingData, updateStatus } = this.props;

        this._settingData = settingData;
        this._devSettingData = devSettingData;
        this._Status = updateStatus;

        let _dataSource = []
        // Display name
        if (devData.length > 0 && (this._Source.length === 0 || this._reload)) {
            devSettingData.map((d) => {
                let _data = {}
                let _dev = devData.filter((dev) => {
                    return dev.devID === d.devID
                })

                if (_dev.length > 0) {
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
            if (objA.devID > objB.devID) return 1;
            if (objA.devID < objB.devID) return -1;
            if (objA.settingName > objB.settingName) return 1;
            if (objA.settingName < objB.settingName) return -1;
            return 0;
        });




        this._reload = false
        const _columns = [
            {
                key: "devMacaddress",
                title: "Device",
                dataIndex: "devMacaddress",
                width: 200
            },
            {
                key: "settingName",
                title: "Setting Name",
                dataIndex: "settingName",
                width: 250

            },
            {
                key: "settingValue",
                title: "Setting Value",
                dataIndex: "settingValue",
                render: (text, record, index) => (
                    <span>
                        {
                            this._openID.indexOf(record.settingName) > -1 || this._displayID.indexOf(record.settingName) > -1 ?
                                <SelectEditCell
                                    value={record.settingValue}
                                    valueText={text}
                                    onChange={this.onCellChange(record.devSettingId, "settingValue")}
                                    option={this.generateOption(record.settingName)}
                                />
                                :
                                <InputEditCell
                                    value={text}
                                    onChange={this.onCellChange(record.devSettingId, "settingValue")}
                                    disable={false}
                                />
                        }
                    </span>
                )
            }
        ]

        return (
            <div className="edulog-container">
                <Row className="row-seprate">
                    <span className="title-medium" >Change Device Setting Value</span>
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

function mapStateToProps(state, ownProps) {
    let AppData = []
    let DevData = []
    let SettingData = []
    let DevSettingData = []
    let ModeData = []
    let UpdateStatus = ""

    if (state.DevData.length > 0) {
        DevData = state.DevData[state.DevData.length - 1].data
    }

    if (state.SettingData.length > 0) {
        SettingData = state.SettingData[state.SettingData.length - 1].data
    }
    if (state.DevSettingData.length > 0) {
        DevSettingData = state.DevSettingData[state.DevSettingData.length - 1].data
    }

    if (state.ModeData.length > 0) {
        ModeData = state.ModeData[state.ModeData.length - 1].data
    }

    if (state.DevSettingUpdate.length > 0) {
        UpdateStatus = state.DevSettingUpdate[state.DevSettingUpdate.length - 1].status
    }


    return {
        modeData: ModeData,
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
export default connect(mapStateToProps, mapDispatchToProps)(DeviceSetting)