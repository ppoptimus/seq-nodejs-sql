//-- ZONE Local --//
const sqlConfig = {
	user: "appseq",
	password: "APP@seq",
	server: "localhost",
	database: "sequester",
	options: {
		encrypt: false,
		charset: "utf8",
	},
}

// //-- ZONE DEV --//
// const sqlConfig = {
// 	user: "appseq",
// 	password: "APP@seq",
// 	server: "172.16.19.41",
// 	database: "sequester",
// 	options: {
// 		encrypt: false,
// 		charset: "utf8",
// 	},
// }

// //-- ZONE UAT --//
// const sqlConfig = {
// 	user: "appseq",
// 	password: "APP@seq",
// 	server: "172.20.91.43",
// 	database: "sequester",
// 	options: {
// 		encrypt: false,
// 		charset: "utf8",
// 	},
// }

module.exports = sqlConfig
