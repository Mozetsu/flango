// game()
const marks = {
	times: 'fas fa-times',
	circle: 'far fa-circle'
};

const currentRoom = '7314';

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
	game.freeCells--;
	console.log(game.freeCells);
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

function checkGameState() {
	if (game.freeCells === 0) endGame([], undefined);
}

function checkWin(win, moves, user) {
	win.forEach(combination => {
		// win
		if (arrayContainsArray(combination, moves)) endGame(combination, user);
		else checkGameState();
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
	// game.playerOne.username = currentPlayer;

	socket.emit('create-room', { playerRoom: currentRoom, username: currentPlayer });
});

socket.on('room-connection', room => {
	// const opponent = players.find(elem => elem !== game.playerOne.username);
	// if (opponent !== undefined) {
	// 	game.playerTwo.username = opponent;
	// 	playerTwoName.innerText = opponent;
	// 	playerTwoScore.classList.add(opponent);
	// }
	console.log(room);
	// console.log(`Connected to [${room}]`);
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
