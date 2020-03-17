const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const hbs = require('express-handlebars');

app.use(express.static('public'));
const PORT = process.env.PORT || 2000;

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
	res.render('game');
});

io.on('connection', socket => {
	console.log(socket.id);
});

server.listen(PORT, () => console.log(`//${PORT}`));
