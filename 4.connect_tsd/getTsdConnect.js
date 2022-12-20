const e = require("connect-timeout");

const GetTsdConnect = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let result = {
        "responseCode":"000",
        "responseStatus":"S",
        "responseMessage":"Success"
     }

    if(username === 'TSD' && password === 'Tsd@12345#.'){

        return res.send(result)
    }
    else {
        return res.status(400).json({ message: "error", description: "invalid username or password" })
    }

}
module.exports = GetTsdConnect