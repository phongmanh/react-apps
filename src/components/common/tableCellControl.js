
import React, { Component } from 'react'
import { Button, Icon, Input, Select, Checkbox, message, Menu, Table, Row, Col } from 'antd'
import PropTypes from 'prop-types';

export class InputEditCell extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            editable: false,
        }

        this.handleChange = this.handleChange.bind(this)
        this.check = this.check.bind(this)
        this.edit = this.edit.bind(this)
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }

    componentWillReceiveProps(newProps, newstate) {
        this.setState({
            value: newProps.value
        })
    }


    render() {
        const { value, editable } = this.state;
        const { disable } = this.props
        return (
            <div className="editable-cell">
                {
                    disable ?
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                        </div>
                        :
                        editable ?
                            <div className="editable-cell-input-wrapper">
                                <Input
                                    value={value}
                                    onChange={this.handleChange}
                                    onPressEnter={this.check}
                                    style={{ width: 100, height: 22 }}

                                />
                                <Icon
                                    type="check"
                                    className="editable-cell-icon-check"
                                    onClick={this.check}
                                />
                            </div>
                            :
                            <div className="editable-cell-text-wrapper">
                                {value || ' '}
                                <Icon
                                    type="edit"
                                    className="editable-cell-icon"
                                    onClick={this.edit}
                                />
                                {/* <a onClick={this.edit} style={{ marginLeft: 50, fontSize: 11, textDecoration: "none" }}>Edit</a> */}
                            </div>
                }
            </div>
        );
    }
}


export class SelectEditCell extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            valueText: this.props.valueText,
            editable: false,
        }
        this._value = ""
        this._valueText = ""

        this.handleChange = this.handleChange.bind(this)
        this.check = this.check.bind(this)
        this.edit = this.edit.bind(this)
    }
    handleChange = (value, option) => {
        let _valueText = option.props.children
        this.setState({ value: value, valueText: _valueText });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);//
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }

    componentWillReceiveProps(newProps, newstate) {
        this.setState({
            value: newProps.value,
            valueText: newProps.valueText,
        })
    }

    render() {
        const { value, valueText, editable } = this.state;
        let _value = value
        let _valueText = valueText

        // cancel edit value
        // if (value !== this.props.value && !editable) {
        //     _value = this.props.value
        //     _valueText = this.props.valueText
        // }
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Select
                                value={_value}
                                onSelect={this.handleChange}
                                style={{ width: 180, height: 22 }}
                            >
                                {this.props.option}
                            </Select>
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {_valueText || ''}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                            {/* <a onClick={this.edit} style={{ marginLeft: 50, fontSize: 11, textDecoration: "none" }}>Edit</a> */}
                        </div>
                }
            </div>
        );
    }
}

SelectEditCell.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    option: PropTypes.array.isRequired,
    valueText: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}