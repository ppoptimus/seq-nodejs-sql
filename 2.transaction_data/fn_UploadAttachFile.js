const multer = require("multer")

const uploadFile = (req, res) => {
    let fileDate = Date.now();
    let fileName;
	let storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "public")
		},
		filename: function (req, file, cb) {
            fileName = fileDate + "_" + file.originalname;
			cb(null, fileDate + "_" + file.originalname)
		},
	})

	let upload = multer({ storage: storage }).single("file")

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err)
		} else if (err) {
			return res.status(500).json(err)
		}
		return res.status(200).json({"status":res.statusText, "file_name":fileName})
	})
}

module.exports = uploadFile
