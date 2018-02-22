
import React, { Component } from 'react'
import { Row, Col, Layout, Menu, Icon } from 'antd'
import '../../src/contents/styles/bootstrap-custom.css'
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom'
import $ from 'jquery'
import DevSetting from '../../src/components/deviceSetting_Multi'
import SystemSetting from '../../src/components/change_system_setting'
import ChangeModule from '../../src/components/change_module'
import DeviceMode from '../../src/components/deviceMode_Multi'
import SetURL from '../../src/components/change_files';
import DevModule from '../../src/components/deviceModule_Multi';
import Billing from '../../src/components/billingType_activityCode';
import Device from '../../src/components/devices';

var config = require('Config')

export default class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
        $('#menu-nav a').focus(function (obj) {
            $('#menu-nav li.active').removeClass('active');
            let parent = $(this).parent();
            $(parent).addClass('active');
        });
    }

    render() {
        ////basename={`${config.siteName}`}
        return (
            <Router>
                <div id="edulog">
                    <Layout>
                        <Layout.Header className="header">
                            <Row gutter={5}>
                                <Col md={4}>
                                </Col>
                                <Col md={16} className="menu-center">
                                    <Menu mode="horizontal" id="menu-nav">
                                        <Menu.Item key="sysSetting">
                                            <Link to={`${process.env.PUBLIC_URL}/sysSetting`}><span>System Setting</span></Link>
                                        </Menu.Item>
                                        <Menu.SubMenu title={<span>Device Settings</span>}>
                                            <Menu.Item key="devSetting">
                                                <Link to={`${process.env.PUBLIC_URL}/devSetting`}><span>Change Device Setting</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="devMode">
                                                <Link to={`${process.env.PUBLIC_URL}/devMode`} > <span>Change Device Mode</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="devModule">
                                                <Link to={`${process.env.PUBLIC_URL}/devModule`}> <span>Change Device Module</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="device">
                                                <Link to={`${process.env.PUBLIC_URL}/device`}><span>Device</span></Link>
                                            </Menu.Item>
                                        </Menu.SubMenu>
                                        <Menu.Item key="module">
                                            <Link to={`${process.env.PUBLIC_URL}/changeModule`}><span>Change Module</span></Link>
                                        </Menu.Item>
                                        <Menu.Item key="setURL">
                                            <Link to={`${process.env.PUBLIC_URL}/setURL`}><span>Set URL</span></Link>
                                        </Menu.Item>
                                        <Menu.Item key="billing">
                                            <Link to={`${process.env.PUBLIC_URL}/billing`}><span>Billing - Activity</span></Link>
                                        </Menu.Item>
                                    </Menu>
                                </Col>
                                <Col md={4}>
                                </Col>
                            </Row>
                        </Layout.Header>
                        <Layout.Content className="content-container">
                            <Route path={`${process.env.PUBLIC_URL}/sysSetting`} component={SystemSetting} />
                            <Route path={`${process.env.PUBLIC_URL}/devSetting`} component={DevSetting} />
                            <Route path={`${process.env.PUBLIC_URL}/devMode`} component={DeviceMode} />
                            <Route path={`${process.env.PUBLIC_URL}/devModule`} component={DevModule} />
                            <Route path={`${process.env.PUBLIC_URL}/device`} component={Device} />
                            <Route path={`${process.env.PUBLIC_URL}/changeModule`} component={ChangeModule} />
                            <Route path={`${process.env.PUBLIC_URL}/setURL`} component={SetURL} />
                            <Route path={`${process.env.PUBLIC_URL}/billing`} component={Billing} />

                        </Layout.Content>
                        {/* <Layout.Footer className="footer">
                            <span>Edulog &copy;2018</span>
                        </Layout.Footer> */}
                    </Layout>
                </div>
            </Router>
        )
    }
}


class Home extends Component {

    render() {
        return null;
    }
}