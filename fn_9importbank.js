const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")

const ImportBank = (req, res) => {
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			let table = new sql.Table()
			table.columns.add("request_code", sql.NVarChar(10), null)
			table.columns.add("document_set", sql.NVarChar(20))
			table.columns.add("bank_code", sql.NVarChar(10))
			table.columns.add("document_date", sql.NVarChar(10))
			table.columns.add("employer_account", sql.NVarChar(10))
			table.columns.add("title_name", sql.NVarChar(50))
			table.columns.add("first_name", sql.NVarChar(20))
			table.columns.add("last_name", sql.NVarChar(50))
			table.columns.add("refference_id", sql.NVarChar(20))
			table.columns.add("branch_code", sql.NVarChar(10))
			table.columns.add("status_code", sql.NVarChar(5))
			table.columns.add("branch_name", sql.NVarChar(100))
			table.columns.add("account_no", sql.NVarChar(20))
			table.columns.add("account_name", sql.NVarChar(100))
			table.columns.add("balance", sql.NVarChar(20))
			table.columns.add("investigate_date", sql.NVarChar(50))
			table.columns.add("remark", sql.NVarChar(255))

			
			for(r of req.body.dataset)
			{
				table.rows.add(req.body.request_code, req.body.document_set, req.body.bank_code, r.document_date, r.employer_account, r.title_name, r.first_name, r.last_name, r.refference_id, r.branch_code, r.status_code, r.branch_name, r.account_no, r.account_name, r.balance, r.investigate_date, r.remark);
			}
			request.input("request_code", sql.NVarChar(10), req.body.request_code)
			request.input("document_set", sql.NVarChar(20), req.body.document_set)
			request.input("user_name", sql.NVarChar(50), req.body.user_name)
			request.input("import_detail", table)
			request.execute("sp_save_import", (err, result) => {
				if(err){

					saveLog("Import file", "error", "execute store", err.originalError, null, req.body.user_name, req.body.ip_address)
				}
				else{return res.status(201).json(result.recordset[0])}
			})
			
		} catch (err) {
			saveLog("Import file", "error", "request body", err.originalError, null, req.body.user_name, req.body.ip_address)
			return res.status(501).json({ message: "error", description: err })
		}
	})
}

module.exports = ImportBank
