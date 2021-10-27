app.post("/api/auth", function (req, res) {
	let dataset = {}
	const client = ldap.createClient({
		url: "ldap://172.20.10.17:389",
	})
	client.bind("uid=appssows,cn=App,ou=internal,DC=ESSS,DC=SSO,DC=GO,DC=TH", "Tory<oN", () => {
		const opts = {
			filter: "(&(uid=bthanapat)(accountActive=TRUE))",
			scope: "sub",
			attributes: ["givenName", "sn", "cn", "SSObranchCode", "ssofirstname", "ssosurname", "ssopersoncitizenid", "uid"],
		}

		client.search("cn=Users,ou=internal,dc=ESSS,dc=SSO,dc=GO,dc=TH", opts, (err, res) => {
			if (err) {
				console.log("err")
				return res.json("err")
			} else {
				res.on("searchEntry", (entry) => {
					let SSObranchCode = JSON.stringify(entry.object.SSObranchCode)
					let ssopersoncitizenid = JSON.stringify(entry.object.ssopersoncitizenid)
					let uid = JSON.stringify(entry.object.uid)
					let ssofirstname = JSON.stringify(entry.object.ssofirstname)
					let ssosurname = JSON.stringify(entry.object.ssosurname)
					dataset = {
						SSObranchCode: SSObranchCode,
						ssopersoncitizenid: ssopersoncitizenid,
						uid: uid,
						ssofirstname: ssofirstname,
						ssosurname: ssosurname,
					}
          console.log(dataset)
				})
			}
		})
	})
})
