//-------Import libary -------//
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

//#region Call another page
const getUserDetail = require("./1.master_data/fn_GetUserDetail")
const getUserLevel = require("./1.master_data/fn_GetUserLevel")
const getTitle = require("./1.master_data/fn_GetTitle")
const checkUserLogin = require("./1.master_data/fn_CheckUserLogin")
const getAllBank = require("./1.master_data/fn_GetAllBanks")
const saveMasterBank = require("./1.master_data/fn_SaveMasterBank")
const editMasterBank = require("./1.master_data/fn_EditMasterBank")
const testConnect = require("./2.transaction_data/fn_0CheckConnect")
const saveRequestDetail = require("./2.transaction_data/fn_1SaveNewRequest")
const getRequestDetail = require("./2.transaction_data/fn_2GetNewRequest")
const changeRequestStatus = require("./2.transaction_data/fn_3ChangeRequestStatus")
const editNewRequest = require("./2.transaction_data/fn_4EditNewRequest")
const generateRequestCode = require("./2.transaction_data/fn_5GenRequestCode")
const getAllRequest = require("./2.transaction_data/fn_6GetAllRequest")
const saveDocumentSet = require("./2.transaction_data/fn_7SaveDocumentSet")
const getDataToExport = require("./2.transaction_data/fn_8GetDataToExport")
const DownloadFile = require("./2.transaction_data/fn_9DownloadFile")
const stampExport = require("./2.transaction_data/fn_10Stamp_export")
const ImportBank = require("./2.transaction_data/fn_11Importbank")
const searchRequest = require("./2.transaction_data/fn_12GetSearchRequest")
const searchRequestDetail = require("./2.transaction_data/fn_13GetSearchRequestDetail")
const saveLog = require("./fn_SaveLog")
const saveMasterUser = require("./1.master_data/fn_SaveMasterUser")
const newsManagement = require("./1.master_data/fn_NewsManagement")
const configManagement = require("./1.master_data/fn_ConfigManagement")
const getMasterNews = require("./1.master_data/fn_GetMasterNews")
const getMasterConfig = require("./1.master_data/fn_GetMasterConfig")
const saveLogLogin = require("./3.log_data/fn_SaveLogLogin")
const saveLogLogout = require("./3.log_data/fn_SaveLogLogout")
const getLogLogin = require("./3.log_data/fn_GetLogLogin")
const getLogEvent = require("./3.log_data/fn_GetLogEvent")
const uploadAttachFile = require("./2.transaction_data/fn_UploadAttachFile")
const downloadAttachFile = require("./2.transaction_data/fn_DownloadAttachFile")
const getLogEventDetail = require("./3.log_data/fn_GetLogEventDetail")
const getLogLoginDetail = require("./3.log_data/fn_GetLogLoginDetail")
const getMasterDepartment = require("./1.master_data/fn_GetMasterDepartment")
const saveMasterDepartment = require("./1.master_data/fn_SaveMasterDepartment")
const deleteMasterUser = require("./1.master_data/fn_DeleteMasterUser")
const getImportHistory = require("./2.transaction_data/fn_GetImportHistory")
const getImportHistoryDetail = require("./2.transaction_data/fn_GetImportHistoryDetail")
const ldapLogin = require("./0.Authen/fn_UATLogin") //เมื่อขึ้น production แล้วเปลี่ยนเป็น path = /fn_LdapLogin.js 
const getExportHistory = require("./2.transaction_data/fn_GetExportHistory")
const getWaitingGenerate = require("./2.transaction_data/fn_GetWaitingGenerate")
const ldapSearch = require("./0.Authen/fn_LdapSearch")
const getExportHistoryDetail = require("./2.transaction_data/fn_GetExportHistoryDetail")
const deleteImportBank = require("./2.transaction_data/fn_DeleteImportBank")
const tsdGetConnect = require("./4.connect_tsd/fn_GetConnection")
//#endregion Call another page ----//

//-------Declare function -------//
const app = express()
app.use(cors())
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const requestStart = Date.now()

//------- Test internal connection -------//
app.get("/api", (req, res) => {
	testConnect(req, res)
})

//------- Login with LDAP -------//
app.post("/api/ldapLogin", (req, res) => {
	ldapLogin(req, res)
})

//------ Search user in LDAP ------//
app.post("/api/ldapSearch", (req, res) => {
	ldapSearch(req, res)
})

//---------- Get All Request to Dashboard------------//
app.get("/api/getAllRequest", (req, res) => {
	getAllRequest(req, res)
})

//--------------- สาขาบันทึกรายการใหม่ -----------------//
app.post("/api/saveNewRequest", (req, res) => {
	res.setHeader("Content-Type", "application/json")
	const { rawHeaders, method, socket, url } = req
	const { remoteAddress, remoteFamily } = socket

	const logDesc = JSON.stringify({
		timestamp: Date.now(),
		processingTime: Date.now() - requestStart,
		rawHeaders: rawHeaders,
		body: JSON.stringify(req.body),
		method: method,
		remoteAddress: remoteAddress,
		remoteFamily: remoteFamily,
		url: url,
	})
	saveLog("Save new Request", "receive json", logDesc, null, null, "system", null)

	saveRequestDetail(req, res)
})

//----------------- ค้นหารายการใหม่ -------------------//
app.post("/api/getNewRequest", async (req, res) => {
	res.setHeader("Content-Type", "application/json")
	const { rawHeaders, method, socket, url } = req
	const { remoteAddress, remoteFamily } = socket

	const logDesc = JSON.stringify({
		timestamp: Date.now(),
		processingTime: Date.now() - requestStart,
		rawHeaders: rawHeaders,
		body: JSON.stringify(req.body),
		method: method,
		remoteAddress: remoteAddress,
		remoteFamily: remoteFamily,
		url: url,
	})
	saveLog("getRequestDetail", "receive json", logDesc, null, null, "system", null)
	getRequestDetail(req, res)
})

//----------------- แก้ไขรายการใหม่ -------------------//
app.post("/api/editNewRequest", (req, res) => {
	editNewRequest(req, res)
})

//--------------- Change Request Status --------------//
app.post("/api/changeRequestStatus", (req, res) => {
	changeRequestStatus(req, res)
})

//--------------- Generate RequestCode --------------//
app.get("/api/autoGenerateCode", (req, res) => {
	generateRequestCode(req, res)
})

//--------------- บันทึกเลขชุดหนังสือ -----------------//
app.post("/api/saveDocumentSet", (req, res) => {
	saveDocumentSet(req, res)
})

//-------------- Stamp export datetime-------------//
app.post("/api/stampExport", (req, res) => {
	stampExport(req, res)
})

//-------------- ดึงข้อมูลมา export excel------------//
app.post("/api/getDataToExport", (req, res) => {
	getDataToExport(req, res)
})

//--------------- ดาวน์โหลดไฟล์ excel--------------//
app.get("/api/download", (req, res) => {
	DownloadFile(req, res)
})

//-------------- Import file from Bank------------//
app.post("/api/importbank", (req, res) => {
	ImportBank(req, res)
})

//---------------- ค้นหารายการทั้งหมด --------------//
app.post("/api/searchRequest", (req, res) => {
	searchRequest(req, res)
})

//-------------- ดึงข้อมูลรายการที่ค้นหา -------------//
app.post("/api/searchRequestDetail", (req, res) => {
	searchRequestDetail(req, res)
})

//-------------- ดาวน์โหลดไฟล์แนบ -------------//
app.get("/api/downloadAttachFile", (req, res) => {
	downloadAttachFile(req, res)
})

//-------- Get user / user detail  --------------//
app.get("/api/getUser", (req, res) => {
	getUserDetail(req, res)
})

//----------- Get user'level  -------------------//
app.get("/api/getUserLevel", (req, res) => {
	getUserLevel(req, res)
})

/**************************************************
//-------check user for update when login --------// //---- ไม่ได้ใช้แล้ว รอลบ----//
 app.post("/api/userLogin", (req, res) => {
 	checkUserLogin(req, res)
 })
 ************************************************/

app.get("/api/getTitle", (req, res) => {
	getTitle(req, res)
})

app.get("/api/getAllBank", (req, res) => {
	getAllBank(req, res)
})

app.post("/api/saveMasterBank", (req, res) => {
	saveMasterBank(req, res)
})

app.post("/api/editMasterBank", (req, res) => {
	editMasterBank(req, res)
})

app.post("/api/saveMasterUser", (req, res) => {
	saveMasterUser(req, res)
})

app.post("/api/newsManagement", (req, res) => {
	newsManagement(req, res)
})

app.post("/api/configManagement", (req, res) => {
	configManagement(req, res)
})

app.get("/api/getMasterNews", (req, res) => {
	getMasterNews(req, res)
})

app.get("/api/getMasterConfig", (req, res) => {
	getMasterConfig(req, res)
})

app.post("/api/saveLogLogin", (req, res) => {
	saveLogLogin(req, res)
})

app.post("/api/saveLogLogout", (req, res) => {
	saveLogLogout(req, res)
})

app.post("/api/getLogLogin", (req, res) => {
	getLogLogin(req, res)
})

app.post("/api/getLogEvent", (req, res) => {
	getLogEvent(req, res)
})

app.post("/api/getLogLoginDetail", (req, res) => {
	getLogLoginDetail(req, res)
})

app.post("/api/getLogEventDetail", (req, res) => {
	getLogEventDetail(req, res)
})

app.post("/api/uploadAttachFile", (req, res) => {
	uploadAttachFile(req, res)
})

app.get("/api/getMasterDepartment", (req, res) => {
	getMasterDepartment(req, res)
})

app.post("/api/saveMasterDepartment", (req, res) => {
	saveMasterDepartment(req, res)
})

app.post("/api/deleteMasterUser", (req, res) => {
	deleteMasterUser(req, res)
})

app.get("/api/getWaitingGenerate", (req, res) => {
	getWaitingGenerate(req, res)
})

app.post("/api/getExportHistory", (req, res) => {
	getExportHistory(req, res)
})

app.post("/api/getExportHistoryDetail", (req, res) => {
	getExportHistoryDetail(req, res)
})

app.post("/api/getImportHistory", (req, res) => {
	getImportHistory(req, res)
})

app.post("/api/getImportHistoryDetail", (req, res) => {
	getImportHistoryDetail(req, res)
})

app.post("/api/deleteImportBank", (req, res) => {
	deleteImportBank(req, res)
})

//------- Test TSD connection -------//
app.post("/api/tsdgetconnection", (req, res) => {
	tsdGetConnect(req, res)
})

//#region Config PORT ---//
const port = process.env.port || 3003
app.listen(port, () => {
	console.log("Application is running on port: " + port)
})
//#endregion
