const Sequelize = require("sequelize");

const db = new Sequelize("node-test", "postgres", "postgres", {
	host: "localhost",
	dialect: "postgres",
});

module.exports = { db };
