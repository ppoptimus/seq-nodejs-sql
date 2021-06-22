const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const saveRequestDetail = (req, res) => {
    sql.connect(config, (err) => {
		let request = new sql.Request()
		request.input("employer_account", sql.VarChar(50), req.body.employer_account)
		request.input("document_no", sql.VarChar(50), req.body.document_no)
		request.input("document_date", sql.VarChar(50), req.body.document_date)
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
		request.execute("sp_save_new_request", (err, result) => {
			if (err) {
				res.status(501).json({ message: "error", description: err.originalError.message })
			}
			else{
				if(result.recordset[0].result == "exists"){
					res.status(200).json(result.recordset[0])
				}
				res.status(201).json(result.recordset[0])
			}
			
		})
		if (err) {
			res.status(400).json({ message: "error", description: err.originalError.message })
		}
	})
}

module.exports = saveRequestDetail;