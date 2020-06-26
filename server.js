require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const hbs = require('express-handlebars');
const Room = require('./src/Room.js');
const { cross, circle, addPlayer, removePlayer } = require('./src/game.js');

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
	socket.on('player-connected', () => {
		socket.emit('player-id', { _id: socket.id });
	});

	socket.on('join-room', ({ player }) => {
		console.log(`${socket.id} joined [${player.room}]`);
		socket.room = player.room;

		// search room index
		const i = rooms.findIndex((room) => room._id === player.room);

		// room not found, create it
		if (i === -1) {
			const room = new Room(player);
			rooms.push(room);
			io.to(player._id).emit('player-mark', { mark: 'cross' });
			return socket.join(room._id, () => {});
		}

		// room exists and is full
		if (i !== -1 && rooms[i].players.length === 2) {
			return io.to(player._id).emit('unable-to-join', { server: 'Room completely full' });
		}

		// room exists and is not full
		if (i !== -1 && rooms[i].players.length < 2) {
			const freePlayer = addPlayer(rooms[i], player);
			console.log({ mark: rooms[i][freePlayer].mark });
			io.to(player._id).emit('player-mark', { mark: rooms[i][freePlayer].mark });
		}

		socket.join(rooms[i]._id, () => {});
	});

	socket.on('player-action', (action) => socket.to(socket.room).emit('player-action', action));

	socket.on('disconnect', () => {
		// search room index
		const i = rooms.findIndex((room) => room._id === socket.room);
		removePlayer(rooms[i], socket.id);
		console.log(`${socket.id} left [${rooms[i]._id}]`);
	});
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
