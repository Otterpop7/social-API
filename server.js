const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(require('./routes'))

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost/social-API',
	{
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
)

mongoose.set('debug', true)
app.listen(PORT, () => console.log(`Listening to localhost:${PORT}`))