const router = express.Router();

//My API routes
router.get("/", (req, res) => {
	const params = req.query.query;
	const collection = client.db("itc-stocks").collection("searches");
	apiSearch(params).then(companyProfiles => {
		if (!(params === null || params === "")) {
			collection.insertOne({
				query: params,
				date: Date(),
				companies: companyProfiles
			});
		} else {
			res.status(400);
		}
		res.json(companyProfiles);
	});
});

router.get("/search-history", (req, res) => {
	const collection = client.db("itc-stocks").collection("searches");
	collection
		.find()
		.sort({ date: -1 })
		.toArray()
		.then(searches => {
			res.render("search-history.handlebars", { history: searches });
		});
});

router.delete("/search-history/:id", (req, res) => {
	const ObjectId = require("mongodb").ObjectID;
	const collection = client.db("itc-stocks").collection("searches");
	const id = req.params.id;
	collection.deleteOne({ _id: ObjectId(`${id}`) });
	collection
		.find()
		.sort({ date: -1 })
		.toArray()
		.then(searches => {
			res.render("search-history.handlebars", { history: searches });
		});
});

module.exports = router;
