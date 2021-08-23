
const DownloadFile = async (req, res) => {
    const request_code = req.query.request_code;
    const file = `${__dirname}/public/SSO_${request_code}_Bank.zip`;
	res.download(file);
}
module.exports = DownloadFile