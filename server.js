require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const hbs = require('express-handlebars');
const Room = require('./src/Room.js');
const { addPlayer, removePlayer } = require('./src/game.js');

app.use(express.json());

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

const PORT = process.env.PORT;

app.get('/:room', (req, res) => {
	res.render('index');
});

// rooms ##########################################################
const rooms = [
	{
		win: [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
			[1, 5, 9],
			[3, 5, 7],
		],
		_id: 'B0T5J7',
		allowedPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		playerOne: {
			_id: 'RPM5fXeaygldbZJsAAAB',
			room: 'B0T5J7',
			username: 'Ghown',
			mark: null,
			opponent: null,
			moves: [],
		},
		playerTwo: null,
		players: ['RPM5fXeaygldbZJsAAAB'],
		playing: null,
		score: { playerOne: 0, playerTwo: 0, tie: 0 },
	},
];

// socket ##########################################################
io.on('connection', (socket) => {
	console.log(`${socket.id} joined`);

	socket.on('player-connected', () => {
		socket.emit('player-id', { _id: socket.id });
	});

	socket.on('join-room', ({ player }) => {
		socket.room = player.room;
		// search room index
		const i = rooms.findIndex((room) => room._id === player.room);

		// if room not found, create it
		if (i === -1) {
			const room = new Room(player);
			rooms.push(room);
		}

		// if room exists and is full
		if (i !== -1 && rooms[i].players.length === 2) {
			return io.to(player._id).emit('unable-to-join', { server: 'Room completely full' });
		}

		addPlayer(rooms[i], player);

		console.log(rooms[i]);

		// socket.join(room, () => {});
	});

	socket.on('disconnect', () => {
		// search room index
		const i = rooms.findIndex((room) => room._id === socket.room);
		removePlayer(rooms[i], socket.id);
		console.log(`${socket.id} left`);
	});
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
