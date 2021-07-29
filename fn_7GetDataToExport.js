const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")
const xlsx = require("xlsx")
const fs = require("fs")
const fsExtra = require("fs-extra")
const archiver = require("archiver")
const getAllBank = require("./fn_get_all_banks")

const getExport = async (req, res) => {
	sql.connect(config, (err) => {
		if (err) {
			saveLog("export request", "error", "sql connect", err.originalError.message, null, req.body.user_name, req.body.ip_address)
			return res.status(400).json({ message: "error", description: err.originalError.message })
		} else {
			let request = new sql.Request()
			request.input("request_code", sql.NVarChar(10), req.body.request_code)
			request.input("document_set_no", sql.NVarChar(50), req.body.document_set_no)
			request.execute("sp_get_export_request", (err, result) => {
				if (err) {
					saveLog("export request", "error", "request body", err.originalError.message, null, req.body.user_name, req.body.ip_address)
					return res.status(501).json({ message: "error", description: err.originalError.message })
				} else {
					saveLog(
						"export request",
						"success",
						"export request code = " + req.body.request_code,
						null,
						"sp_export_request",
						req.body.user_name,
						req.body.ip_address
					)
					try {
						let dirName = `SSO_${req.body.request_code}_Bank`
						let dir = `${dirName}`

						//------------step1 Create directory------------//
						createDir(dir)
						//-----------step2 Generate excel file---------//

						// if (genearteExcel(result.recordset)) {
						// 	console.log(genearteExcel)
						// 	//-----------step3 Zip dierectory--------------//
						// 	zipDirectory(`./tmp/${dir}`, `./tmp/${dirName}.zip`)
						// } else {
						// 	console.log(genearteExcel)
						// }
	
						getAllBank();
						return res.status(200).json(result.recordset)
					} catch (error) {
						return res.status(501).json({ message: "error", description: error })
					}
				}
			})
		}
	})
}

const createDir = async (dir) => {
	await fsExtra.emptyDirSync("./tmp")
	fs.mkdirSync(`./tmp/${dir}`)
}

const genearteExcel = (content, fileName) => {
	try {
		let newWorkbook = xlsx.utils.book_new()
		let newWorksheet = xlsx.utils.json_to_sheet(content)
		xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, fileName)
		xlsx.writeFile(newWorkbook, "./tmp/newExcel.xlsx")
	} catch (error) {
		throw error
	}

}

function zipDirectory(source, out) {
	const archive = archiver("zip", { zlib: { level: 9 } })
	const stream = fs.createWriteStream(out)

	return new Promise((resolve, reject) => {
		archive
			.directory(source, false)
			.on("error", (err) => reject(err))
			.pipe(stream)

		stream.on("close", () => resolve())
		archive.finalize()
	})
}

module.exports = getExport
