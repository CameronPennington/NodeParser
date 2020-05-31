const Parser = require("rss-parser");
const parser = new Parser();
const { db } = require("./config/database");
const FeedSource = require("./config/models").FeedSource;
const Entry = require("./config/models").Entry;
const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");

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

const fetchLinks = async (items) => {
	let contentCollector = [];
	let i = 0;
	for await (let item of items) {
		let content;

		try {
			content = await axios.get(item.url);
		} catch (err) {
			content = { data: "Content could not be retrieved" };
		}
		content = await JSON.stringify(content.data);
		fs.writeFile(`content${i}`, content, (err) => {
			if (err) console.log(err);
		});
		i++;

		contentCollector.push(content);
	}
	//need to reverse order because push adds items at the end
	return contentCollector.reverse();
};

const formatItems = async (items) => {
	const formattedItems = await items.map((item) => {
		return {
			feedsourceId: item.id,
			url: item.link,
			title: item.title,
			id_on_feed: item.guid,
			published_date: item.pubDate,
		};
	});
	return formattedItems;
};

const filterItems = (items) => {
	const filteredItems = items.filter(
		(item) => !item.link.includes("video") && !item.link.includes("live-news")
	);
	// console.log(filteredItems);
	return filteredItems;
};

const getAllEntriesFromAllSources = async () => {
	const sources = await getSources();
	let entryCollector = [];

	for (let source of sources) {
		//get items
		let items = await getFeedItems(source.url);
		//filter items
		let filteredItems = await filterItems(items);
		//format items
		let formattedItems = await formatItems(filteredItems);
		//retrieve full content
		let content = await fetchLinks(formattedItems);
		// TODO: Use cheerio to trim content

		let formattedItemsWithFullContent = formattedItems.map((entry, i) => {
			return (entry.content = content[i]);
		});

		// entryCollector.push(formattedItemsWithFullContent);
	}

	return entryCollector.flat();
};

//TODO: bulk create records

module.exports = {
	getAllEntriesFromAllSources,
};
