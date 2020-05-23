const Sequelize = require("sequelize");
const db = require("./database").db;

//maybe make id_on_feed a unique field to prevent duplicates?
const Entry = db.define("entry", {
	url: {
		type: Sequelize.STRING,
	},
	content: {
		type: Sequelize.STRING(3000),
	},
	title: {
		type: Sequelize.STRING(500),
	},
	id_on_feed: {
		type: Sequelize.STRING,
	},
	published_date: {
		type: Sequelize.DATE,
	},
});

const FeedSource = db.define("feedsource", {
	name: {
		type: Sequelize.ENUM("CNN", "FOX", "MSNBC"),
	},
	feed_url: {
		type: Sequelize.STRING,
	},
	category: {
		type: Sequelize.STRING,
	},
});

FeedSource.hasMany(Entry, { as: "FeedItems" });
// Entry.belongsTo(FeedSource, { as: "Source" });

db.sync();
module.exports = {
	Entry,
	FeedSource,
};
