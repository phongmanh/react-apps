
var Config = require('Config')


// Device settings (mam_device_settings)

export const AppId_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/application/"
export const SettingName_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/settings/"
export const DevSetting_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/deviceSettings/"
export const DevSetting_Update_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/deviceSettings/update/"


// System setting (Mam_Settings)

export const SysSetting_Update_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/settings/update/"
export const SysSetting_Create_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/settings/create/"

// Device Mode Change

export const DevMode_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mdm/devicemode/"
export const DevMode_Update_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mdm/devicemode/update/"
export const mdmMode_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mdm/modes/"


// Modules

export const Module_Update_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/modules/update/"
export const Module_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/modules/"


// Mam fiels

export const Files_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/fullfiles/"
export const Files_Update_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/files/update/"
export const Files_Create_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/files/create/"

// Mam device module


export const DevModule_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/devmodule/"
export const DevModule_Update_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/devmodule/update/"


// Billing 

export const NameSub_Url = Config.serverUrl + "/" + Config.serverPrefix + "/ename/namesubcategory/"
export const EventCode_Url = Config.serverUrl + "/" + Config.serverPrefix + "/etext/eventcode/"
export const Billing_Update_Url = Config.serverUrl + "/" + Config.serverPrefix + "/dp/billingactivity/update/"
export const Billing_Create_Url = Config.serverUrl + "/" + Config.serverPrefix + "/dp/billingactivity/create/"
export const Billing_Delete_Url = Config.serverUrl + "/" + Config.serverPrefix + "/dp/billingactivity/delete/"
export const Billing_Activity_Url = Config.serverUrl + "/" + Config.serverPrefix + "/dp/billingactivity/"

// DEvices

export const DevID_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/devices/"
export const Dev_Create_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/device/create/"
export const Dev_Delete_Url = Config.serverUrl + "/" + Config.serverPrefix + "/mam/device/delete/"