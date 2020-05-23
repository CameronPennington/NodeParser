const { db } = require("./config/database");
const Parser = require("rss-parser");
const parser = new Parser();
const Entry = require("./config/models").Entry;

const getFeedItems = require("./helperFunctions").getFeedItems;
const getSources = require("./helperFunctions").getSources;
const fetchLink = require("./helperFunctions").fetchLink;
const getAllEntriesFromAllSources = require("./helperFunctions")
	.getAllEntriesFromAllSources;

db.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

const testEntries = [
	{ url: "http://feeds.foxnews.com/foxnews/opinion", id: 1 },
];

getAllEntriesFromAllSources(testEntries);

// getSources();
// feedGetter("http://feeds.foxnews.com/foxnews/opinion");
// fetchLink(
// 	"https://www.cnn.com/2020/05/22/asia/pakistan-plane-crash-intl/index.html"
// );

// (async () => {
// 	let feed = await parser.parseURL("http://feeds.foxnews.com/foxnews/health");
// 	console.log(feed.title);

// 	// feed.items.forEach((item) => {
// 	// 	console.log(item.title + ":" + item.link);
// 	// });
// 	console.log(feed.items[0]);
// })();

// const newEntry = async () => {
// 	return await Entry.create({
// 		url: "Alpha",
// 		content: "Alpha",
// 		title: "Alpha",
// 	});
// };

// console.log(newEntry);
