const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const hbs = require('express-handlebars');

app.use(express.static('public'));
const PORT = process.env.PORT || 4000;

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

const rooms = [];

app.get('/', (req, res) => {
	res.render('game');
});

// socket
io.on('connection', socket => {
	socket.on('create-room', ({ room, username }) => {
		socket.join(room, () => {
			// add room if doesnt exists
			if (!rooms.find(srvRoom => srvRoom['room'] === room)) {
				rooms.push({ room, players: [username] });
			} else {
				// add user if room already exists
				const roomIndex = rooms.findIndex(obj => obj.room === room);
				rooms[roomIndex].players.push(username);
			}
			// finds player room
			const currentRoom = rooms.find(srvRoom => srvRoom['room'] === room);
			io.in(room).emit('room-connection', currentRoom);
		});
	});

	socket.on('player-action', ({ room, username, moves }) => {
		socket.broadcast.to(room).emit('player-move', { username, moves });
	});

	socket.on('restart-game', ({ room }) => {
		socket.broadcast.to(room).emit('restart');
		console.log(`Room to restart: ${room}`);
	});

	socket.on('disconnect', () => {
		console.log('Player disconnected');
	});
});

server.listen(PORT, () => console.log(`//${PORT}`));
