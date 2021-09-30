const sql = require("mssql")
const config = require("../dbConfig")

const getUserDetail = (req, res) => {
	sql.connect(config, (err) => {
		if (err) {
			return res.status(400).json({ message: "error", description: err.originalError.message })
		}

		let request = new sql.Request()
		request.execute("sp_get_user_level", (err, result) => {
			if (err) {
				return res.status(501).json({ message: "error", description: err.originalError.message })
			}
			res.status(200).json(result.recordset)
		})
	})
}

module.exports = getUserDetail
