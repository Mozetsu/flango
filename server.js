require('dotenv').config();
const express = require('express');
const app = express();
const hbs = require('express-handlebars');

app.use(express.json());

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

const PORT = process.env.PORT;

app.get('/', function (req, res) {
	res.render('index');
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
