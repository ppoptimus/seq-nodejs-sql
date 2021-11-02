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
const ldapLogin = require("./0.Authen/fn_UATLogin")
const getExportHistory = require("./2.transaction_data/fn_GetExportHistory")
const getWaitingGenerate = require("./2.transaction_data/fn_GetWaitingGenerate")
//#endregion Call another page ----//

//-------Declare function -------//
const app = express()
app.use(cors())
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const requestStart = Date.now()

//------- Test connection -------//
app.get("/api", (req, res) => {
	testConnect(req, res)
})

//--------------- Save data input from Branch -----------------//
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

//------------------ Search request detail -------------------//
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

//---------------- CHange Request Status -----------------//
app.post("/api/changeRequestStatus", (req, res) => {
	changeRequestStatus(req, res)
})

app.get("/api/autoGenerateCode", (req, res) => {
	generateRequestCode(req, res)
})

app.get("/api/getAllRequest", (req, res) => {
	getAllRequest(req, res)
})

app.post("/api/saveDocumentSet", (req, res) => {
	saveDocumentSet(req, res)
})

app.post("/api/stampExport", (req, res) => {
	stampExport(req, res)
})

app.post("/api/editNewRequest", (req, res) => {
	editNewRequest(req, res)
})

app.post("/api/getDataToExport", (req, res) => {
	console.log("get")
	getDataToExport(req, res)
})

app.get("/api/download", (req, res) => {
	DownloadFile(req, res)
})

app.post("/api/importbank", (req, res) => {
	ImportBank(req, res)
})

app.post("/api/searchRequest", (req, res) => {
	searchRequest(req, res)
})

app.post("/api/searchRequestDetail", (req, res) => {
	searchRequestDetail(req, res)
})

//--------------- Get user / user detail  --------------------//
app.get("/api/getUser", (req, res) => {
	getUserDetail(req, res)
})

//--------------- Get user' level  --------------------//
app.get("/api/getUserLevel", (req, res) => {
	getUserLevel(req, res)
})

app.get("/api/getTitle", (req, res) => {
	getTitle(req, res)
})

//---------check user for update when login ----------//
app.post("/api/userLogin", (req, res) => {
	checkUserLogin(req, res)
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

app.get("/api/downloadAttachFile", (req, res) => {
	downloadAttachFile(req, res)
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

app.post("/api/getExporttHistory", (req, res) => {
	getExportHistory(req, res)
})

app.post("/api/getImportHistory", (req, res) => {
	getImportHistory(req, res)
})

app.post("/api/getImportHistoryDetail", (req, res) => {
	getImportHistoryDetail(req, res)
})

app.post("/api/ldapLogin", (req, res) => {
	ldapLogin(req, res)
})

//#region Config PORT ---//
const port = process.env.port || 3000
app.listen(port, () => {
	console.log("Application is running on port: " + port)
})
//#endregion
