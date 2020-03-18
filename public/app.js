// game()
const marks = {
	times: 'fas fa-times',
	circle: 'far fa-circle'
};

const player = {
	room: '7314',
	description: undefined,
	id: undefined,
	username: undefined,
	opponent: undefined,
	mark: undefined,
	moves: []
};

// client
const playerOneName = document.querySelector('.player-one-username');
const playerOneScore = document.getElementById('player-one-score');
const playerTwoName = document.querySelector('.player-two-username');
const playerTwoScore = document.getElementById('player-two-score');
const tieScore = document.getElementById('tie');
const gameCellsWrapper = document.querySelector('.grid-wrapper');
const gameCells = document.querySelectorAll('.cell');
const notifications = document.querySelector('.turn');
const restartBtn = document.querySelector('#restart');

gameCells.forEach(cell => cell.addEventListener('click', pickCell));
restartBtn.addEventListener('click', () => {
	socket.emit('restart-game', { room });
});

function pickCell() {
	// add item if cell is empty
	if (!this.hasChildNodes()) {
		const tmp = document.createElement('i');
		tmp.classList = `${marks[player.mark]}`;
		this.appendChild(tmp);
		player.moves.push(this.id);
	}

	socket.emit('player-action', {
		room: player.room,
		username: player.username,
		moves: player.moves
	});
}

function endGame(arr, usr) {
	// tie
	if (!usr) {
		game.tie++;
		tieScore.innerText = game.tie;
		game.freeCells = 9;
	}

	// user
	if (usr === game.playerOne.username) {
		game.playerOne.score++;
		playerOneScore.innerText = game.playerOne.score;
	} else {
		game.playerTwo.score++;
		playerTwoScore.innerText = game.playerTwo.score;
	}

	notifications.style.display = 'none';
	restartBtn.style.display = 'inline';

	gameCells.forEach(cell => {
		cell.removeEventListener('click', pickCell);
		cell.style.cursor = 'auto';
	});

	arr.forEach(elem => {
		const cell = document.getElementById(elem);
		// opponent won
		if (usr !== game.playerOne.username) {
			cell.style.background = '#ffd1e7';
		} else {
			cell.style.background = '#d1eeff';
		}
	});
}

function startGame() {
	restartBtn.style.display = 'none';
	notifications.style.display = 'flex';

	// resets player's moves
	game.playerOne.moves.length = 0;
	game.playerTwo.moves.length = 0;

	// resets UI
	gameCells.forEach(cell => {
		cell.innerHTML = '';
		cell.style.background = '#fff';
		cell.style.cursor = 'pointer';
		cell.addEventListener('click', pickCell);
	});
}

// socket
const socket = io();

socket.on('connect', () => {
	// client
	player.username = window.prompt('Enter your Username');
	playerOneName.innerText = `${player.username}`;
	playerOneScore.classList.add(player.username);

	socket.emit('create-room', { playerRoom: player.room, username: player.username });
});

socket.on('room-connection', ({ room, data }) => {
	console.log(room);
	// console.log(data);
	if (player.description === 'playerOne') {
		player.opponent = data.playerTwo.username;
		player.mark = data.playerOne.mark;
	} else {
		player.opponent = data.playerOne.username;
		player.mark = data.playerTwo.mark;
	}
	player.opponent ? (playerTwoName.innerText = player.opponent) : (playerTwoName.innerText = 'Player Two');
});

socket.on('private', ({ description, id }) => {
	player.description = description;
	player.id = id;
});

socket.on('player-move', ({ username, moves }) => {
	const lastMove = moves[moves.length - 1];
	const cell = gameCellsWrapper.children[lastMove - 1];
	const tmp = document.createElement('i');

	// current player played
	if (username === player.username) {
		tmp.classList = `${marks[player.mark]}`;
	} else {
		// opponent played
		const tmpArray = Object.keys(marks);
		const opponentMark = tmpArray.find(mark => mark !== player.mark);
		tmp.classList = `${marks[opponentMark]}`;
	}

	cell.appendChild(tmp);
	// checkWin(winCombinations, playerObj.moves, playerObj.username);
});

socket.on('restart', () => {
	startGame();
});

socket.on('player-left', data => {
	console.log(data);
	player.opponent = undefined;
	playerTwoName.innerText = 'Player Two';
});
