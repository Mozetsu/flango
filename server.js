require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const hbs = require('express-handlebars');
const Room = require('./src/room.js');

app.use(express.json());

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

const PORT = process.env.PORT;

app.get('/:room', (req, res) => {
	res.render('index');
});

// rooms ##########################################################
const rooms = [];

// socket ##########################################################
io.on('connection', (socket) => {
	console.log(`${socket.id} joined`);

	socket.on('player-connected', () => {
		socket.emit('player-id', { _id: socket.id });
	});

	socket.on('join-room', ({ room, playerId, username }) => {
		// create room if it doesnt exist
		const i = rooms.findIndex((i) => i === room);
		console.log(i);

		if (i < 0) {
			const gameRoom = new Room(room, playerId, username);
			rooms.push(gameRoom);
		}
		socket.join(room, () => {});
	});

	socket.on('disconnect', () => {
		console.log(`${socket.id} left`);
	});
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
