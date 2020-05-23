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
	// console.log(typeof feed.items);
	return feed.items;
};

const fetchLink = async (link) => {
	const fetchedLink = await axios.get(link);
	return fetchedLink.data;
};

const getAllEntriesFromSingleSource = async (source) => {};

const getAllEntriesFromAllSources = async (sources) => {
	let entries = [];
	sources.forEach(async (source) => {
		//find latest date for source?
		const id = source.id;
		const singleFeedItems = await getFeedItems(source.url);

		const formattedSingleFeedItems = singleFeedItems.map((entry) => {
			return {
				feedsourceId: id,
				url: entry.link,
				title: entry.title,
				id_on_feed: entry.guid,
				published_date: entry.pubDate,
			};
		});

		formattedSingleFeedItems.forEach((entry) => {
			entries.push(entry);
		});
	});

	return entries;
};
//save the datetime of the latest post, and filter items so that only new entries are included

//prune and push items onto entries array

module.exports = {
	getFeedItems,
	fetchLink,
	getSources,
	getAllEntriesFromAllSources,
};
