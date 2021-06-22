const sql = require("mssql")
const config = require("./dbConfig")

const testConnect = (req, res) => {
    var result = {};
	sql.connect(config, function (err){
		if (err) {
			result = {"apiservice":"connected" ,"database":"not connect!"}
		}else {
			result = {"apiservice":"connected" ,"database":"connected"}
		}
		res.send(result)
	})
}

module.exports = testConnect;