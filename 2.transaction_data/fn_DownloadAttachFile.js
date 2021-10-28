const fs = require('fs');

const downloadAttachFile = async (req, res) => {
	const file_name = req.query.file_name
	const file = `./public/attach/${file_name}`
	res.download(file)
}

const downloadAttachFile2 = async(req, res) => {
	const dir = `./public/attach/`
	fs.readdirSync(dir).forEach(files => {
		if(req.query.file_name === files.split('.').slice(0, -1).join('.')){
			const file = `./public/attach/${files}`
			res.download(file)
		}
	});
}
module.exports = downloadAttachFile2
