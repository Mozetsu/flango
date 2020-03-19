const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const hbs = require('express-handlebars');
const { winCombinations, room: data, randomIntFromInterval, checkWin } = require('./src/game');

app.use(express.static('public'));
const PORT = process.env.PORT || 4000;

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
	res.render('game');
});

const rooms = [
	{
		room: '9730',
		data: {
			tie: 0,
			freeCells: 9,
			players: 0,
			playerOne: {
				id: 93184719327419,
				username: 'Mozetsu',
				mark: 'times',
				moves: [],
				score: 0
			},
			playerTwo: {
				id: 93187719327419,
				username: 'Ainz',
				mark: 'circle',
				moves: [],
				score: 0
			}
		}
	}
];

const getRoomIndex = (serverRooms, currentRoom) => {
	return serverRooms.findIndex(serverRoom => serverRoom['room'] === currentRoom);
};

const populatePlayer = (room, increment, id, username, player) => {
	increment ? room.data.players++ : room.data.players--;
	room.data[player].id = id;
	room.data[player].username = username;
	room.data[player].moves = [];
	room.data[player].score = 0;
};

const resetOpponent = (room, player) => {
	room.data.tie = 0;
	room.data.freeCells = 9;
	room.data.playing = undefined;

	if (player === 'playerOne') {
		room.data.playerTwo.moves.length = 0;
		room.data.playerTwo.score = 0;
	} else {
		room.data.playerOne.moves.length = 0;
		room.data.playerOne.score = 0;
	}
};

const removePlayer = playerId => {
	// console.log(playerId);
	rooms.forEach(room => {
		// if player is player one
		if (playerId === room.data.playerOne.id) {
			console.log(`Server: ${room.data.playerOne.username} left [${room.room}]`);
			// removes player one
			populatePlayer(room, undefined, undefined, undefined, 'playerOne');
			// resets player two
			resetOpponent(room, 'playerOne');
			io.to(room.room).emit('player-left', room);
		}

		// if player is player two
		if (playerId === room.data.playerTwo.id) {
			console.log(`Server: ${room.data.playerTwo.username} left [${room.room}]`);
			populatePlayer(room, undefined, undefined, undefined, 'playerTwo');
			// resets player one
			resetOpponent(room, 'playerTwo');
			io.to(room.room).emit('player-left', room);
		}
	});
};

const addRoom = (serverRooms, roomName, username, userId) => {
	// find room index
	const roomIndex = getRoomIndex(serverRooms, roomName);

	// check if room is full
	if (roomIndex !== -1) {
		if (serverRooms[roomIndex].data.players === 2) return { error: 'Room is full' };
	}

	// add room if it doesnt exist
	// and populate player one
	if (roomIndex === -1) {
		rooms.push({ room: roomName, data });
		const currentRoom = getRoomIndex(serverRooms, roomName);
		// populate player one data
		populatePlayer(serverRooms[currentRoom], 1, userId, username, 'playerOne');
		io.to(userId).emit('private', { description: 'playerOne', id: userId });
		console.log(`Server: ${username} joined [${roomName}]`);
	} else {
		//if room exists search for empty player
		const i = getRoomIndex(serverRooms, roomName);

		// player one empty
		if (!serverRooms[i].data.playerOne.username) {
			populatePlayer(serverRooms[i], 1, userId, username, 'playerOne');
			io.to(userId).emit('private', { description: 'playerOne', id: userId });
			console.log(`Server: ${username} joined [${serverRooms[i].room}]`);
		} else {
			// player two empty
			populatePlayer(serverRooms[i], 1, userId, username, 'playerTwo');
			io.to(userId).emit('private', { description: 'playerTwo', id: userId });
			console.log(`Server: ${username} joined [${serverRooms[i].room}]`);
		}
	}
};

// socket
io.on('connection', socket => {
	socket.on('create-room', ({ playerRoom, username }) => {
		socket.join(playerRoom, () => {
			addRoom(rooms, playerRoom, username, socket.id);
			// finds player room
			const i = getRoomIndex(rooms, playerRoom);
			io.in(playerRoom).emit('room-connection', rooms[i]);

			// start game
			if (rooms[i].data.players === 2) {
				const availablePlayers = ['playerOne', 'playerTwo'];
				const playerStart = randomIntFromInterval(0, 1);
				rooms[i].data.playing = availablePlayers[playerStart];
				io.to(rooms[i].room).emit('player-turn', { firstPlayer: rooms[i].data.playing });
			}
		});
	});

	socket.on('player-action', ({ room, username, description, moves }) => {
		const i = getRoomIndex(rooms, room);
		rooms[i].data.freeCells--;
		rooms[i].data[description].moves.push(moves[moves.length - 1]);

		// check win
		const gameResult = checkWin(winCombinations, rooms[i].data[description].moves, username, rooms[i].data.freeCells);

		socket.broadcast.to(room).emit('player-move', { username, moves });

		// win or tie
		if (gameResult) {
			if (gameResult.result === 'win') {
				rooms[i].data[description].score++;
				return io.in(rooms[i].room).emit('game-end', {
					description,
					score: rooms[i].data[description].score,
					arr: gameResult.winArray
				});
			} else {
				rooms[i].data.tie++;
				return io.in(rooms[i].room).emit('game-end', { description: 'tie', score: rooms[i].data.tie, arr: [] });
			}
		}
	});

	socket.on('next-turn', ({ room }) => {
		const i = getRoomIndex(rooms, room);
		rooms[i].data.playing === 'playerOne'
			? (rooms[i].data.playing = 'playerTwo')
			: (rooms[i].data.playing = 'playerOne');

		io.to(room).emit('player-turn', { firstPlayer: rooms[i].data.playing });
	});

	socket.on('restart-game', ({ room }) => {
		const i = getRoomIndex(rooms, room);
		rooms[i].data.freeCells = 9;
		rooms[i].data.playerOne.moves.length = 0;
		rooms[i].data.playerTwo.moves.length = 0;
		io.in(room).emit('restart');
		io.to(room).emit('player-turn', { firstPlayer: rooms[i].data.playing });
		// console.log(`Room to restart: ${playerRoom}`);
	});

	socket.on('disconnect', () => {
		removePlayer(socket.id);
	});
});

server.listen(PORT, () => console.log(`//${PORT}`));
