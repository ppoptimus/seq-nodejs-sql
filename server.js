//-------Import libary -------//
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

//------Call another page -------//
const saveLog = require("./fn_SaveLog")
const getUserDetail = require("./fn_GetUserDetail")
const getUserLevel = require("./fn_GetUserLevel")
const testConnect = require("./fn_0CheckConnect")
const saveRequestDetail = require("./fn_1SaveNewRequest")
const getRequestDetail = require("./fn_2GetNewRequest")
const changeRequestStatus = require("./fn_3ChangeRequestStatus")
const editNewRequest = require("./fn_4EditNewRequest")
const generateRequestCode = require("./fn_5GenRequestCode")
const saveDocumentSet = require("./fn_6SaveDocumentSet")
const getDataToExport = require("./fn_7GetDataToExport")
const stampExport = require("./fn_8Stamp_export")
const ImportBank = require("./fn_9Importbank")
const DownloadFile = require("./fn_DownloadFile")
const searchRequest = require("./fn_10GetSearchRequest")
const getTitle = require("./fn_GetTitle")
const checkUserLogin = require("./fn_CheckUserLogin")
const searchRequestDetail = require("./fn_12GetSearchRequestDetail")

//-------Declare function -------//
const app = express()
app.use(cors())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
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
	console.log("load")
	DownloadFile(req, res)
})

app.post("/api/importbank", (req, res) => {
	ImportBank(req, res)
})

app.post("/api/searchRequest", (req, res) => {
	searchRequest(req, res)
})

app.get("/api/searchRequestDetail", (req, res) => {
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
//------------------------------------------------------------------------------------------------------//
const port = process.env.port || 5000
app.listen(port, () => {
	console.log("Application is running on port: " + port)
})
