app.post("/api/authenldap", function (req, res) {
	//console.log(req.body)
	function ldapsearch(ldapdetail) {
		res.json(ldapdetail)
	}

	const client = ldap.createClient({
		url: "ldap://172.20.10.17:389",
	})
	client.bind("uid=appssows,cn=App,ou=internal,DC=ESSS,DC=SSO,DC=GO,DC=TH", "Tory<oN", (err) => {
		if (err) {
			res.json("err")
		}
	})

	const opts = {
		filter: "(|(uid=" + req.body.userldap + ")(ssopersoncitizenid=" + req.body.userldap + "))",
		scope: "sub",
		attributes: ["givenName", "sn", "cn", "SSObranchCode", "ssofirstname", "ssosurname", "ssopersoncitizenid", "uid", "dn"],
	}

	client.search("cn=Users,ou=internal,dc=ESSS,dc=SSO,dc=GO,dc=TH", opts, (err, res) => {
		if (err) {
			console.log(err)
		} else {
			res.on("searchEntry", (entry) => {
				let SSObranchCode = entry.object.SSObranchCode
				let ssopersoncitizenid = entry.object.ssopersoncitizenid
				let uid = entry.object.uid
				let ssofirstname = entry.object.ssofirstname
				let ssosurname = entry.object.ssosurname
				let dn = entry.object.dn
				dataset = {
					SSObranchCode: SSObranchCode,
					ssopersoncitizenid: ssopersoncitizenid,
					uid: uid,
					ssofirstname: ssofirstname,
					ssosurname: ssosurname,
				
				}

				const clientuser = ldap.createClient({
					url: "ldap://172.20.10.17:389",
				})
				clientuser.bind(dn, req.body.password, function (err) {
					if (err == null) {
						ldapsearch(dataset)

						//     res.json('lll');
					} else {
						ldapsearch("no login")
					}
				})
			})

			//   res.on('end', () => {
			//    ldapsearch(member);
			//    });
		}

		//    console.log(member);
	})
})
