require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const hbs = require('express-handlebars');

app.use(express.json());

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

const PORT = process.env.PORT;

app.get('/', function (req, res) {
	res.render('index');
});

// socket
io.on('connection', (socket) => {
	console.log(`${socket.id}`);

	socket.on('disconnect', () => {
		removePlayer(socket.id);
	});
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
