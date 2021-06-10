//-------Import libary -------//
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const sql = require("mssql")
const timeout = require("connect-timeout")

//------Call another page -------//
const config = require("./dbConfig")
const saveLog = require("./saveLog")

//-------Declare function -------//
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//------- Test connection -------//
app.get("/", (req, res) => {
	res.send("connected ^_^")
})

//----------------- Call store with query string --------------------//
//--------------------- Search request detail -----------------------//
let log_event
let log_result
let log_description
let error_description
let related_table

app.post("/getRequestDetail", timeout("10s"), async (req, res) => {
	const requestStart = Date.now();
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

	saveLog("getRequestDetail", "receive json", logDesc, error_description, related_table, "system", null)

	//------------create query string -------------//
	res.setHeader("Content-Type", "application/json")
	const employer_account = req.body.employer_account === null ? null : req.bodymployer_account.toString()
	const refference_id = req.body.refference_id === null ? null : req.body.refference_id.toString()
	const first_name = req.body.first_name === null ? null : req.body.first_name.toString()
	const last_name = req.body.last_name === null ? null : req.body.last_name.toString()
	const company_name = req.body.company_name === null ? null : req.body.company_name.toString()
	const from_date = req.body.from_date === null ? null : req.body.from_date.toString()
	const to_date = req.body.to_date === null ? null : req.body.to_date.toString()
	const address = req.body.address === null ? null : req.body.address.toString()
	const remark = req.body.remark === null ? null : req.body.remark.toString()
	const department_id = req.body.department_id
	const create_by = req.body.create_by === null ? null : req.body.create_by.toString()
	const update_by = req.body.update_by === null ? null : req.body.update_by.toString()
	const ip_address = req.body.ip_address === null ? null : req.body.ip_address.toString()
	const qryString = `EXEC [dbo].[sp_get_request_detail]
    @p_employer_account = ${employer_account},
    @p_refference_id = ${refference_id},
    @p_first_name = ${first_name},
    @p_last_name = ${last_name},
    @p_company_name = ${company_name},
    @p_from_date = ${from_date},
    @p_to_date = ${to_date},
    @p_address = ${address},
    @p_remark = ${remark},
    @p_department_id = ${department_id},
    @p_create_by = ${create_by},
    @p_update_by = ${update_by},
	@ip_address = '${ip_address}'`

	log_event = "getRequestDetail"
	related_table = "t_trans_request_detail"

	sql.connect(config, (err) => {
		let request = new sql.Request()
		request.query(qryString, (err, result) => {
			if (err) {
				const request = JSON.stringify(req.body)
				log_result = "error"
				log_description = "function request.query \n"
				error_description = err.originalError + request

				saveLog(log_event, log_result, log_description, error_description, related_table, create_by, ip_address);
				res.json({ message: "error", description: err.originalError });
			} else {
				log_result = "success"
				log_description = "EXEC sp_get_request_detail"
				
				saveLog(log_event, log_result, log_description, error_description, related_table, create_by, ip_address);
				res.json(result.recordset)
			}
		})
		if (err) {
			log_result = "error"
			log_description = "function sql.connect"
			error_description += err
			saveLog(log_event, log_result, log_description, error_description, related_table, create_by, ip_address)
			res.json({ message: "error", description: error_description })
		}
	})
})


//------------ Call store with parameter ----------------//
//--------------- Save data input from Branch --------------------//
app.post("/api/saveDataBranch", (req, res) => {
	sql.connect(config, (err) => {
		let request = new sql.Request()
		request.input("employer_account", sql.VarChar(50), req.body.employer_account)
		request.input("refference_id", sql.VarChar(50), req.body.refference_id)
		request.input("title_id", sql.VarChar(50), req.body.title_id)
		request.input("fisrt_name", sql.VarChar(50), req.body.fisrt_name)
		request.input("last_name", sql.VarChar(50), req.body.last_name)
		request.input("company_name", sql.VarChar(50), req.body.company_name)
		request.input("birth_date", sql.VarChar(50), req.body.birth_date)
		request.input("address", sql.VarChar(50), req.body.address)
		request.input("remark", sql.VarChar(50), req.body.remark)
		request.input("department_id", sql.VarChar(50), req.body.department_id)
		request.input("create_by", sql.VarChar(50), req.body.create_by)
		request.input("ip_address", sql.VarChar(50), req.body.ip_address)
		request.input("is_confirm", sql.VarChar(50), req.body.is_confirm)
		request.execute("sp_save_request_from_branch", (err, result) => {
			if (err) {
				res.json({ message: "error", description: err })
			}
			res.status(201).json(result.recordset)
		})
		if (err) {
		}
	})
})

//------------------------------------------------------------------------------------------------------//

const port = process.env.port || 5000
app.listen(port, () => {
	console.log("Application is running on port: " + port)
})
