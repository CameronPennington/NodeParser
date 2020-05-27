const { db } = require("./config/database");

const getAllEntriesFromAllSources = require("./helperFunctions")
	.getAllEntriesFromAllSources;

db.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

getAllEntriesFromAllSources();
