const sql = require("mssql")
const config = require("../dbConfig")
const saveLog = require("../fn_SaveLog")

const ImportBank = (req, res) => {
	
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			request.input("request_code", sql.NVarChar(10), req.body.request_code)
			request.input("bank_code", sql.NVarChar(10), req.body.bank_code)
			request.execute("sp_check_exists_import", (err, result) => {
				if(err){return res.status(501).json({ message: "error", description: err })}
				if (result.recordset[0].count === 0) {
					for (let x in req.body.dataset) {
						
						let request = new sql.Request()
						request.input("request_code", sql.NVarChar(10), req.body.request_code)
						request.input("document_set", sql.NVarChar(20), req.body.document_set)
						request.input("user_name", sql.NVarChar(50), req.body.user_name)
						request.input("bank_code", sql.NVarChar(10), req.body.bank_code)
		
						request.input("document_date", sql.NVarChar(20), req.body.dataset[x].document_date)
						request.input("employer_account", sql.NVarChar(10), req.body.dataset[x].employer_account)
						request.input("title_name", sql.NVarChar(100), req.body.dataset[x].title_name)
						request.input("first_name", sql.NVarChar(100), req.body.dataset[x].first_name)
						request.input("last_name", sql.NVarChar(100), req.body.dataset[x].last_name)
						request.input("refference_id", sql.NVarChar(20), req.body.dataset[x].refference_id)
						request.input("branch_code", sql.NVarChar(10), req.body.dataset[x].branch_code)
						request.input("status_code", sql.NVarChar(5), req.body.dataset[x].status_code)
						request.input("branch_name", sql.NVarChar(100), req.body.dataset[x].branch_name)
						request.input("account_no", sql.NVarChar(20), req.body.dataset[x].account_no)
						request.input("account_type_code", sql.NVarChar(5), req.body.dataset[x].account_type_code)
						request.input("account_name", sql.NVarChar(1000), req.body.dataset[x].account_name)
						request.input("balance", sql.NVarChar(50), req.body.dataset[x].balance)
						request.input("investigate_date", sql.NVarChar(30), req.body.dataset[x].investigate_date)
						request.input("remark", sql.NVarChar(2000), req.body.dataset[x].remark)
						request.execute("sp_save_import", (err, result) => {
							if (err) {
								console.log("1  " + err)
								saveLog("Import file", "error", "execute store", err.originalError, null, req.body.user_name, req.body.ip_address)
								return res.status(501).json({ message: "error", description: err.originalError.message })
							}
						
						})
					}
					return res.status(200).json({message: "success"})
				}
				else {
					return res.status(208).json({message: "already exists"})
				}
			})
			
			
		} catch (err) {
			console.log("2  " + err)
			saveLog("Import file", "error", "request body", err.originalError, null, req.body.user_name, req.body.ip_address)
			return res.status(501).json({ message: "error", description: err })
		}
	})
}

module.exports = ImportBank
