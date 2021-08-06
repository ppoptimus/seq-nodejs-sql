const sql = require("mssql")
const config = require("./dbConfig")
const saveLog = require("./fn_SaveLog")
const xlsx = require("xlsx")
const { existsSync, mkdirSync, createWriteStream, appendFile, read } = require("fs")
const fsExtra = require("fs-extra")
const archiver = require("archiver")

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
						let dirNameZip = `SSO_${req.body.request_code}_Bank`

						//------------step1 Create folder------------//
						createDirZip(dirNameZip)

						//------------get bank code---------------------//
						let request = new sql.Request()
						request.execute("sp_get_bank_code", (err, bankCode) => {
							bankCode.recordset.forEach((obj) => {
								Object.entries(obj).forEach(([key, value]) => {
									let dirBank = `SSO_${value}_${req.body.request_code}`
									if (existsSync(`./tmp/${dirNameZip}`)) {
										//-----------step2 create sup folder---------//
										createDirBank(dirNameZip, dirBank)

										//-----------step3 Generate excel file---------//
										genearteExcel(result.recordset, dirNameZip, dirBank, dirBank)
										generateText(result.recordset, dirNameZip, dirBank, dirBank)
										
										//-----------step4 Zip dierectory--------------//
										zipDirectory(`./tmp/${dirNameZip}`, `./tmp/${dirNameZip}`)
									}
								})
							})
						})

						return res.status(200).json(result.recordset)
					} catch (error) {
						return res.status(501).json({ message: "error", description: error + "step try" })
					}
				}
			})
		}
	})
}

const createDirZip = (dir) => {
	// if (!existsSync("./tmp")) {
	// 	mkdirSync("./tmp")
	// }
	fsExtra.emptyDirSync("./tmp")
	mkdirSync(`./tmp/${dir}`)
}

const createDirBank = (dirZip, dirBank) => {
	mkdirSync(`./tmp/${dirZip}/${dirBank}`)
}

const genearteExcel = (content, folderZip, folderBank, fileName) => {
	var Heading = [
		["เลขที่ชุดข้อมูล", "เลขที่หนังสือ", "วันที่หนังสือ", "เลขที่บัญชีนายจ้าง", "คำนำหน้าชื่อ/ประเภทธุรกิจ", "ชื่อ", "สกุล", "เลขประจำตัวประชาชน/เลขทะเบียนพาณิชย์", "วัน เดือน ปี เกิด", "ที่อยู่"],
	  ];
	try {
		let newWorkbook = xlsx.utils.book_new()
		let newWorksheet = xlsx.utils.json_to_sheet(Heading, {skipHeader: true})
		xlsx.utils.sheet_add_json(newWorksheet, content, { skipHeader: true, origin: -1});

		xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, fileName)
		xlsx.writeFile(newWorkbook, `./tmp/${folderZip}/${folderBank}/${fileName}.xlsx`)
	} catch (error) {
		throw error
	}
}

const generateText = (content, folderZip, folderBank, fileName) => {
	
	for (let i = 0; i < content.length; i++) {
		let str =
			content[i].request_code +
			content[i].document_set_no +
			content[i].document_set_date +
			content[i].employer_account +
			content[i].title_name +
			content[i].first_name +
			content[i].last_name +
			content[i].refference_id +
			content[i].birth_date +
			content[i].address
		// console.log(str)
		appendFile(`./tmp/${folderZip}/${folderBank}/${fileName}.txt`, str + '\r\n', "utf8", function(err){
		if(err){throw err}
	})
	}
}

const zipDirectory = (source, out) => {
	const archive = archiver("zip", { zlib: { level: 9 } })
	const stream = createWriteStream(`${out}.zip`)

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
