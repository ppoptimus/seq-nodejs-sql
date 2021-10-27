const sql = require("mssql")
const config = require("../dbConfig")

const ldapLogin = (req, res) => {
	
	sql.connect(config, () => {
		try {
			let request = new sql.Request()
			request.input("user_name", sql.NVarChar(50), req.body.user_name)
			request.execute("sp_save_log_login", () => {})
			let userDetail = {}
			switch (req.body.user_name) {
				case "uatadmin":
					userDetail = {
						username: req.body.user_name,
						first_name: "ทดสอบ",
						last_name: "แอดมิน",
						personal_id: "1234567890123",
						department_code: "1000",
						userlevel_id: "2",
						user_level_name: "admin",
					}
					break

				case "uatuser":
					userDetail = {
						username: req.body.user_name,
						first_name: "ทดสอบ",
						last_name: "ผู้ใช้สาขา",
						personal_id: "1234567890123",
						department_code: "1003",
						userlevel_id: "3",
						user_level_name: "user",
					}
					break
				default:
					break
			}
			return res.status(200).json(userDetail)

		} catch (err) {
			saveLog("save log login", "error", "request body", err.message, null, req.body.user_name, null)
			return res.status(501).json({ message: "error", description: err.message })
		}
	})
}

module.exports = ldapLogin
