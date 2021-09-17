const sql = require("mssql")
const config = require("./dbConfig")

const checkUserLogin = (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
			return res.status(400).json({ message: "error", description: err.originalError.message })
		}

        let request = new sql.Request()
		request.input("personal_type", sql.NChar(50), req.body.username)
		request.execute("sp_get_title", (err, result) => {
			if (err) {
				res.status(501).json({ message: "error", description: err.originalError.message })
			}
			res.status(200).json(result.recordset)
		})
    })
}