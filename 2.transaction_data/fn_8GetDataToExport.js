const sql = require('mssql')
const config = require('../dbConfig')
const saveLog = require('../fn_SaveLog')
const xlsx = require('xlsx')
const { existsSync, mkdirSync, createWriteStream, appendFile } = require('fs')
const fsExtra = require('fs-extra')
const archiver = require('archiver')
const fs = require('fs')
const axios = require('axios')
const e = require('connect-timeout')

const getExport = async (req, res) => {
	sql.connect(config, (err) => {
		if (err) {
			saveLog('export request', 'error', 'sql connect', err.originalError.message, null, req.body.user_name, req.body.ip_address)
			return res.status(400).json({ message: 'error', description: err.originalError.message })
		} else {
			let request = new sql.Request()
			request.input('request_code', sql.NVarChar(10), req.body.request_code)
			request.input('document_set_no', sql.NVarChar(50), req.body.document_set_no)
			request.execute('sp_get_data_to_export', (err, result) => {
				if (err) {
					saveLog('export request', 'error', 'request body', err.originalError.message, null, req.body.user_name, req.body.ip_address)
					return res.status(501).json({ message: 'error', description: err.originalError.message })
				} else {
					saveLog('export request', 'success', 'export request code = ' + req.body.request_code, null, 'sp_export_request', req.body.user_name, req.body.ip_address)
					try {
						let dirNameZip = `SSO_${req.body.request_code}_Bank`

						//------------step1 Create folder------------//
						createDirZip(dirNameZip)

						//------------get bank code---------------------//
						let request = new sql.Request()
						request.execute('sp_get_bank_code', (err, bankCode) => {
							bankCode.recordset.forEach((obj) => {
								Object.entries(obj).forEach(([key, value]) => {
									let dirBank = `SSO_${value}_${req.body.request_code}`
									if (existsSync(`public/export/${dirNameZip}`)) {
										//-----------step2 create sup folder---------//
										createDirBank(dirNameZip, dirBank)

										//-----------step3 Generate excel file---------//
										genearteExcel(result.recordset, dirNameZip, dirBank, dirBank)
										generateText(result.recordset, dirNameZip, dirBank, dirBank)

										//console.log(`public/export/${dirNameZip}`,'  ',dirBank)
										zipDirectory(`public/export/${dirNameZip}`, `public/export/${dirNameZip}`)
									}
								})
							})
						})

						return res.status(204).json(result.recordset[0])
					} catch (error) {
						return res.status(501).json({ message: 'error', description: error + 'step try' })
					}
				}
			})
		}
	})
}

const createDirZip = (dir) => {
	fsExtra.emptyDirSync(`public/export`)
	mkdirSync(`public/export/${dir}`)
}

const createDirBank = (dirZip, dirBank) => {
	mkdirSync(`public/export/${dirZip}/${dirBank}`)
}

const genearteExcel = (content, folderZip, folderBank, fileName) => {
	var Heading = [
		['เลขที่ชุดข้อมูล', 'เลขที่หนังสือ', 'วันที่หนังสือ', 'เลขที่บัญชีนายจ้าง', 'คำนำหน้าชื่อ/ประเภทธุรกิจ', 'ชื่อ', 'สกุล', 'เลขประจำตัวประชาชน/เลขทะเบียนพาณิชย์', 'วัน เดือน ปี เกิด', 'ที่อยู่'],
	]
	try {
		let newWorkbook = xlsx.utils.book_new()
		let newWorksheet = xlsx.utils.json_to_sheet(Heading, { skipHeader: true })
		xlsx.utils.sheet_add_json(newWorksheet, content, { skipHeader: true, origin: -1 })

		xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, fileName)
		xlsx.writeFile(newWorkbook, `public/export/${folderZip}/${folderBank}/${fileName}.xlsx`)
	} catch (error) {
		throw error
	}
}

const generateText = (content, folderZip, folderBank, fileName) => {
	let iconv = require('iconv-lite')
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

		buf = iconv.encode(str, 'tis620')
		str = iconv.decode(Buffer.from(buf), 'tis620')
		let pathFile1 = `public/export/${folderZip}/${folderBank}/${fileName}'1'.txt`
		let pathFile2 = `public/export/${folderZip}/${folderBank}/${fileName}.txt`

		fs.writeFile(pathFile1, str, (err) => {
			if (err) {
				console.log(err)
			} else {
				let reader = fs.createReadStream(pathFile1).pipe(iconv.decodeStream('utf8')).pipe(iconv.encodeStream('tis620')).pipe(fs.createWriteStream(pathFile2))
				if (reader) {
				}
				var haderr = false
				reader.on('error', function (err) {
					haderr = true
				})
				reader.on('close', function () {
					if (!haderr) {
						fs.unlink(pathFile1, (err) => {
							if (err) {
								console.error(err)
								return
							}
						})
					}
				})
			}
		})

		// 	appendFile(`public/export/${folderZip}/${folderBank}/${fileName}.txt`, str + '\r\n', "ascii", function(err){
		// 	if(err){
		// 		console.log('สร้างไฟล์ไม่สำเร็จ:',err)
		// 	}
		// })
	}
}

const zipDirectory = (source, out) => {
	const archive = archiver('zip', { zlib: { level: 9 } })
	const stream = createWriteStream(`${out}.zip`)

	return new Promise((resolve, reject) => {
		archive
			.directory(source, false)
			.on('error', (err) => reject(err))
			.pipe(stream)

		stream.on('close', () => resolve())
		archive.finalize()
	})
}

const isConverted = () => {
	const data = {
		name: 'Deven Rathore',
		age: 21,
	}
	return true
}

module.exports = getExport
