const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const hbs = require('express-handlebars');
const { winCombinations, room: data } = require('./src/game');

app.use(express.static('public'));
const PORT = process.env.PORT || 4000;

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
	res.render('game');
});

// console.log(winCombinations);
// console.log(room);

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
};

const removePlayer = playerId => {
	// console.log(playerId);
	rooms.forEach(room => {
		// if player is player one
		if (playerId === room.data.playerOne.id) {
			console.log(`Server: ${room.data.playerOne.username} left [${room.room}]`);
			populatePlayer(room, undefined, undefined, undefined, 'playerOne');
			io.to(room.room).emit('player-left', room);
		}

		// if player is player two
		if (playerId === room.data.playerTwo.id) {
			console.log(`Server: ${room.data.playerTwo.username} left [${room.room}]`);
			populatePlayer(room, undefined, undefined, undefined, 'playerTwo');
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
			// console.log(rooms, playerRoom, username, socket.id);
			// console.log(addRoom(rooms, playerRoom, username, socket.id));
			addRoom(rooms, playerRoom, username, socket.id);
			// finds player room
			const roomIndex = getRoomIndex(rooms, playerRoom);
			io.in(playerRoom).emit('room-connection', rooms[roomIndex]);
		});
	});

	socket.on('player-action', ({ room, username, moves }) => {
		socket.broadcast.to(room).emit('player-move', { username, moves });
	});

	socket.on('restart-game', ({ playerRoom }) => {
		io.in(playerRoom).emit('restart');
		// console.log(`Room to restart: ${playerRoom}`);
	});

	socket.on('disconnect', () => {
		removePlayer(socket.id);
	});
});

server.listen(PORT, () => console.log(`//${PORT}`));
