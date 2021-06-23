const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const saveRequestDetail = (req, res) => {
	
    sql.connect(config, (err) => {
		let request = new sql.Request()
		request.input("employer_account", sql.NVarChar(10), req.body.employer_account)
		request.input("document_no", sql.NVarChar(20), req.body.document_no)
		request.input("document_date", sql.NVarChar(20), req.body.document_date)
		request.input("refference_id", sql.NVarChar(20), req.body.refference_id)
		request.input("title_code", sql.NVarChar(10), req.body.title_code)
		request.input("fisrt_name", sql.NVarChar(50), req.body.fisrt_name)
		request.input("last_name", sql.NVarChar(50), req.body.last_name)
		request.input("company_name", sql.NVarChar(100), req.body.company_name)
		request.input("birth_date", sql.NVarChar(20), req.body.birth_date)
		request.input("address", sql.NVarChar(255), req.body.address)
		request.input("remark", sql.NVarChar(255), req.body.remark)
		request.input("department_code", sql.NVarChar(10), req.body.department_code)
		request.input("create_by", sql.NVarChar(50), req.body.create_by)
		request.input("ip_address", sql.NVarChar(20), req.body.ip_address)
		request.input("is_confirm", sql.Int, req.body.is_confirm)
		request.execute("sp_save_new_request", (err, result) => {
			if (err) {
				return res.status(501).json({ message: "error", description: err.originalError.message })
			}
			else{
				if(result.recordset[0].result == "exists"){
					return res.status(200).json(result.recordset[0])
				}
				res.status(201).json(result.recordset[0])
			}
			
		})
		if (err) {
			return res.status(400).json({ message: "error", description: err.originalError.message })
		}
	})
}

module.exports = saveRequestDetail;