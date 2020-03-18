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

const rooms = [];

const getRoomIndex = (serverRooms, currentRoom) => {
	return serverRooms.findIndex(serverRoom => serverRoom['room'] === currentRoom);
};

const addRoom = (serverRooms, roomName, username, userId) => {
	// find room index
	const roomIndex = getRoomIndex(serverRooms, roomName);
	// console.log(roomIndex);
	// check if room is full
	if (roomIndex !== -1) {
		if (serverRooms[roomIndex].data.players === 2) return { error: 'Room is full' };
	}
	// console.log(rooms);
	// console.log(roomIndex);

	// add room if it doesnt exist
	if (roomIndex === -1) {
		rooms.push({ room: roomName, data });
		const currentRoom = getRoomIndex(serverRooms, roomName);
		// populate player one data
		serverRooms[currentRoom].data.players++;
		serverRooms[currentRoom].data.playerOne.id = userId;
		serverRooms[currentRoom].data.playerOne.username = username;
		console.log(serverRooms[currentRoom]);
	} else {
		const currentRoom = getRoomIndex(serverRooms, roomName);
		// populate player two data
		serverRooms[currentRoom].data.players++;
		serverRooms[currentRoom].data.playerTwo.id = userId;
		serverRooms[currentRoom].data.playerTwo.username = username;
		console.log(serverRooms[currentRoom]);
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

	socket.on('player-action', ({ playerRoom, username, moves }) => {
		socket.broadcast.to(playerRoom).emit('player-move', { username, moves });
	});

	socket.on('restart-game', ({ playerRoom }) => {
		io.in(playerRoom).emit('restart');
		// console.log(`Room to restart: ${playerRoom}`);
	});

	socket.on('disconnect', () => {
		console.log('Player disconnected');
	});
});

server.listen(PORT, () => console.log(`//${PORT}`));
