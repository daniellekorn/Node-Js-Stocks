const express = require("express");
const cors = require("cors");
const key = require("./routes/key");
const exphbs = require("express-handlebars");
const apiSearch = require("./routes/api/search");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

// Prevent prevention error from broswer
app.use(cors());

//Mongo DB
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
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

app.get("/search", (req, res) => {
	const params = req.query.query;
	const collection = client.db("itc-stocks").collection("searches");
	apiSearch(params).then(companyProfiles => {
		if (!(params === null || params === "")) {
			collection.insertOne({
				query: params,
				date: Date(),
				companies: companyProfiles
			});
			console.log("added");
		} else {
			res.status(400);
		}
		res.json(companyProfiles);
	});
});

app.get("/search-history", (req, res) => {
	const collection = client.db("itc-stocks").collection("searches");
	collection
		.find()
		.sort({ date: 1 })
		.toArray()
		.then(searches => {
			res.send(searches);
		});
});

app.delete("/search-history/:id", (req, res) => {
	const collection = client.db("itc-stocks").collection("searches");
	const id = req.params.id;
	collection.deleteOne({ _id: ObjectId(`${id}`) });
	collection
		.find()
		.sort({ date: 1 })
		.toArray()
		.then(searches => {
			res.send(searches);
		});
});

PORT = 5000;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
	console.log("Press Ctrl+C to quit.");
});
