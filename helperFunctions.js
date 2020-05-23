const Parser = require("rss-parser");
const parser = new Parser();
const { db } = require("./config/database");
const FeedSource = require("./config/models").FeedSource;
const Entry = require("./config/models").Entry;
const axios = require("axios");

//Retrieve all records in feedsource table
const getSources = async () => {
	const sources = await FeedSource.findAll();
	const formattedSources = sources.map((item) => {
		return {
			url: item.dataValues.feed_url,
			id: item.dataValues.id,
		};
	});

	return formattedSources;
};

//for each record, pass in the url and retrieve the items
const getFeedItems = async (feedURL) => {
	const feed = await parser.parseURL(feedURL);

	return feed.items;
};

const fetchLink = async (link) => {
	const fetchedLink = await axios.get(link);
	return fetchedLink.data;
};

const formatEntries = async (feedItems) => {
	feedItems.map((item) => {
		return {
			feedsourceId: id,
			url: item.link,
			title: item.title,
			id_on_feed: item.guid,
			published_date: item.pubDate,
		};
	});
};

const getAllEntriesFromAllSources = async (sources) => {
	let entryCollector = [];

	for (const source of sources) {
		let items = await getFeedItems(source.url);
		tempSources.push(items);
	}

	console.log(entryCollector);
};

// return {
// 	feedsourceId: id,
// 	url: entry.link,
// 	title: entry.title,
// 	id_on_feed: entry.guid,
// 	published_date: entry.pubDate,
// };
//save the datetime of the latest post, and filter items so that only new entries are included

//prune and push items onto entries array

module.exports = {
	getFeedItems,
	fetchLink,
	getSources,
	getAllEntriesFromAllSources,
};
