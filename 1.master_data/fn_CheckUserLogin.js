const sql = require("mssql")
const config = require("../dbConfig")

const checkUserLogin = (req, res) => {
	sql.connect(config, (err) => {
		if (err) {
			return res.status(400).json({ message: "error", description: err.originalError.message })
		}

		let request = new sql.Request()
		request.input("user_name", sql.NChar(50), req.body.user_name)
		request.input("first_name", sql.NChar(50), req.body.first_name)
		request.input("last_name", sql.NChar(50), req.body.last_name)
		request.input("department_code", sql.NChar(50), req.body.department_code)
		request.execute("sp_user_login", (err, result) => {
			if (err) {
				res.status(501).json({ message: "error", description: err.originalError.message })
			}
			res.status(200).json(result.recordset)
		})
	})
}

module.exports = checkUserLogin
