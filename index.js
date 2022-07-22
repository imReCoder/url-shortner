require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
// import the model here
const ShortURL = require('./models/url')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', async (req, res) => {
	// Grab the fullUrl parameter from the req.body
	const fullUrl = req.body.url
	console.log('URL requested: ', fullUrl)

	// insert and wait for the record to be inserted using the model
	const record = new ShortURL({
		full: fullUrl
	})

	await record.save()
  res.json({original_url:record.full,short_url:record.short})
})

app.get("/api/shortUrl/:shortId",async()=>{
	const shortid = req.params.shortId
	const rec = await ShortURL.findOne({ short: shortid })
	if (!rec) return res.sendStatus(404)
	rec.clicks++;
	await rec.save()
	res.redirect(rec.full)
})

// Setup your mongodb connection here
mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.on('open', async () => {
	// Wait for mongodb connection before server starts

	app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${port}`);
	})
})