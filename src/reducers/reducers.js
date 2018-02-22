import { combineReducers } from 'redux'
import { filterActions } from 'redux-ignore'
import * as types from '../../src/actions/actionTypes'
import { devSetting } from './devSettingReducer'
import { sysSetting } from './sysSettingReducer'
import { devMode } from './devModeReducer'
import { modules } from './moduleReducer'
import { files } from './filesReducer'
import { devModule } from './devModeulReducer'
import { billingActivity } from './billingActivityReducer'
import { device } from './deviceReducer'


const reducersApp = combineReducers({
    pageLoad: filterActions(devSetting, [types.PAGE_LOAD]),
    AppData: filterActions(devSetting, [types.LOAD_APP]),
    SettingData: filterActions(sysSetting, [types.LOAD_SETTING]),
    DevSettingData: filterActions(devSetting, [types.LOAD_DEVSETTING]),
    DevSettingUpdate: filterActions(devSetting, [types.UPDATE_DEVSETTING]),
    SysSettingUpdate: sysSetting,
    DevModeUpdate: filterActions(devMode, [types.UPDATE_DEVMODE]),
    DevModeData: filterActions(devMode, [types.LOAD_DEVMODE]),
    ModeData: filterActions(devMode, [types.LOAD_MODE]),
    ModuleData: filterActions(modules, [types.LOAD_MODULE]),
    ModuleUpdate: filterActions(modules, [types.UPDATE_MODULE]),
    FilesData: filterActions(files, [types.LOAD_FILES]),
    FilesUpdate: filterActions(files, [types.UPDATE_FILES]),
    DevModuleData: filterActions(devModule, [types.LOAD_DEVMODULE]),
    DevModuleUpdate: filterActions(devModule, [types.UPDATE_DEVMODULE]),
    BillingData: filterActions(billingActivity, [types.LOAD_BILLING_ACTIVITY]),
    BillingUpdate: filterActions(billingActivity, [types.UPDATE_BILLING_ACTIVITY]),
    BillingID: filterActions(billingActivity, [types.LOAD_BILLINGID]),
    StartID: filterActions(billingActivity, [types.LOAD_STARTID]),
    DevData: filterActions(device, [types.LOAD_DEV]),
    DevUpdate: filterActions(device, [types.UPDATE_DEV]),
})

export default reducersApp;