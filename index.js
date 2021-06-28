//-------Import libary -------//
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

//------Call another page -------//
const saveLog = require("./fn_SaveLog")
const testConnect = require("./fn_CheckConnect")
const getRequestDetail = require("./fn_GetNewRequest")
const saveRequestDetail = require("./fn_SaveNewRequest")
const getUserDetail = require("./fn_GetUserDetail")
const getUserLevel = require("./fn_GetUserLevel")
const changeRequestStatus = require("./fn_ChangeRequestStatus")

//-------Declare function -------//
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const requestStart = Date.now();

//------- Test connection -------//
app.get("/", (req, res) => {
	testConnect(req,res)
})


//--------------------- Search request detail -----------------------//
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
	getRequestDetail(req,res)
})


//--------------- Save data input from Branch --------------------//
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

	saveRequestDetail(req, res);
})


//--------------- Get user / user detail  --------------------//
app.get("/api/getUser", (req, res) => {
	getUserDetail(req,res);
})


//--------------- Get user' level  --------------------//
app.get("/api/getUserLevel", (req, res) => {
	getUserLevel(req, res);
})


//---------------- CHange Request Status -----------------//
app.post("/api/changeRequestStatus", (req, res) => {
	changeRequestStatus(req, res);
})
//------------------------------------------------------------------------------------------------------//
const port = process.env.port || 5000
app.listen(port, () => {
	console.log("Application is running on port: " + port)
})
