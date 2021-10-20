const sql = require("mssql")
const config = require("../dbConfig")

const ldapLogin = (req, res) => {
	
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			request.input("user_name", sql.NVarChar(50), req.body.user_name)
			request.execute("sp_save_log_login", () => {

				const testObject = {
					username: req.body.user_name,
					first_name: "myname",
					last_name: "surname",
					personal_id: "8945633452",
					department_code: "1003",
					userlevel_id: "2",
					user_level_name: "admin",
				}
				res.status(200).json(testObject)
			})

			
		} catch (err) {
			saveLog("save log login", "error", "request body", err.message, null, req.body.user_name, null)
			return res.status(501).json({ message: "error", description: err.message })
		}
	})
}

module.exports = ldapLogin
