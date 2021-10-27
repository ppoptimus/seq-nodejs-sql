const downloadAttachFile = async (req, res) => {
	const file_name = req.query.file_name
	const file = `./public/attach/${file_name}`
	res.download(file)
}
module.exports = downloadAttachFile
