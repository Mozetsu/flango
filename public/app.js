// game()
const marks = {
	times: 'fas fa-times',
	circle: 'far fa-circle'
};

const game = {
	room: 'DDDD',
	playerOne: {
		username: 'Player One',
		mark: 'times',
		moves: [],
		score: 0
	},
	playerTwo: {
		username: 'Player Two',
		mark: 'circle',
		moves: [],
		score: 0
	}
};

const winCombinations = [
	// rows
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 9],
	// columns
	[1, 4, 7],
	[2, 5, 8],
	[3, 6, 9],
	// diagoanl
	[1, 5, 9],
	[3, 5, 7]
];

// client
const playerOneName = document.querySelector('.player-one-username');
const playerOneScore = document.getElementById('player-one-score');
const playerTwoName = document.querySelector('.player-two-username');
const playerTwoScore = document.getElementById('player-two-score');
const gameCellsWrapper = document.querySelector('.grid-wrapper');
const gameCells = document.querySelectorAll('.cell');
const notifications = document.querySelector('.turn');
const restartBtn = document.querySelector('#restart');

gameCells.forEach(cell => cell.addEventListener('click', pickCell));
restartBtn.addEventListener('click', () => {
	startGame();
	socket.emit('restart-game', { room: game.room });
});

function pickCell() {
	// add item if empty
	if (!this.hasChildNodes()) {
		const tmp = document.createElement('i');
		tmp.classList = `${marks[game.playerOne.mark]}`;
		this.appendChild(tmp);
		game.playerOne.moves.push(this.id);
		checkWin(winCombinations, game.playerOne.moves, game.playerOne.username);
		socket.emit('player-action', {
			room: game.room,
			username: game.playerOne.username,
			moves: game.playerOne.moves
		});
	}
}

function checkWin(win, moves, user) {
	win.forEach(combination => {
		// win
		if (arrayContainsArray(combination, moves)) endGame(combination, user);
	});
}

function endGame(arr, usr) {
	// user
	// document.querySelector(usr).innerText =
	notifications.style.display = 'none';
	restartBtn.style.display = 'inline';

	// game.score++;
	// playerOneScore.innerText = player.score;

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

function arrayContainsArray(arr1, arr2) {
	const verifyArr = [];
	arr1.forEach(elem1 => {
		if (arr2.find(elem2 => elem2 == elem1)) verifyArr.push(elem1);
	});
	return verifyArr.length === arr1.length;
}

// socket
const socket = io();

socket.on('connect', () => {
	// client
	const currentPlayer = window.prompt('Enter your Username');
	playerOneName.innerText = `${currentPlayer}`;
	playerOneScore.classList.add(currentPlayer);
	game.playerOne.username = currentPlayer;

	// const room = generate({ characters: 'number', length: 4 });
	socket.emit('create-room', { room: game.room, username: game.playerOne.username });
});

socket.on('room-connection', ({ players }) => {
	const opponent = players.find(elem => elem !== game.playerOne.username);
	if (opponent !== undefined) {
		game.playerTwo.username = opponent;
		playerTwoName.innerText = opponent;
		playerTwoScore.classList.add(opponent);
	}
});

socket.on('player-move', playerObj => {
	const lastMove = playerObj.moves[playerObj.moves.length - 1];
	const cell = gameCellsWrapper.children[lastMove - 1];
	const tmp = document.createElement('i');

	// opponent played
	if (playerObj.username !== game.playerOne.username) {
		tmp.classList = `${marks[game.playerTwo.mark]}`;
	} else {
		tmp.classList = `${marks[game.playerOne.mark]}`;
	}

	cell.appendChild(tmp);
	checkWin(winCombinations, playerObj.moves, playerObj.username);
});

socket.on('restart', () => {
	startGame();
});
