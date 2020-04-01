const express = require("express");
const fetch = require("isomorphic-fetch");
const bodyParser = require("body-parser");
const cors = require("cors");
const key = require("./key");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Mongo DB code
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://eliaye:${key}@cluster0-yoyrf.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

client.connect(err => {
	if (!err) {
		console.log("Mongodb connected successfully");
	} else {
		console.log(err);
		client.close();
	}
});

async function searchNasdaq(query) {
	let response = await fetch(
		`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`
	);
	let data = await response.json();
	return data;
}

async function optimizedSearch(query) {
	const data = await searchNasdaq(query);
	let j = 0;
	let triplets = [];
	triplets.push([]);
	for (let i = 1; i <= data.length; i++) {
		triplets[j].push(data[i - 1].symbol);

		if (i % 3 == 0) {
			triplets.push([]);
			j++;
		}
	}
	const tripletStrings = triplets.map(triple => {
		return triple.join();
	});

	try {
		let profileData = await Promise.all(
			tripletStrings.map(item =>
				fetch(
					`https://financialmodelingprep.com/api/v3/company/profile/${item}`
				)
					.then(r => r.json())
					.catch(error => ({ error, url }))
			)
		);
		/*account for differences in API index names*/
		let allTogether = [];
		for (let i = 0; i < profileData.length; i++) {
			/*mult. req at once vs. single req*/
			if (i < profileData.length - 1) {
				allTogether.push(profileData[i].companyProfiles);
			} else {
				allTogether.push(profileData[i]);
			}
		}
		let merged = [].concat.apply([], allTogether);
		return merged;
	} catch (err) {
		console.log(err);
	}
}

app.get("/search", (req, res) => {
	const params = req.query.query;
	const collection = client.db("itc-stocks").collection("search-history");
	optimizedSearch(params).then(companyProfiles => {
		collection.insertOne({
			query: params,
			date: Date(),
			companies: companyProfiles
		});
		res.json(companyProfiles);
	});
});

PORT = 3030;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
	console.log("Press Ctrl+C to quit.");
});
