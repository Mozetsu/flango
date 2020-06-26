function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function ministring(length = 5, characters = 'numbers, lowercase, uppercase') {
	const allowedCharacters = {
		specials: '!@#$%^&*?'.split(''),
		numbers: '0123456789'.split(''),
		lowercase: 'abcdefghijklmnopqrstuvwxyz'.split(''),
		uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
	};

	const selectedCharacters = characters.replace(/ /g, '').split(',');
	const verifiedCharacters = [];
	for (const character of selectedCharacters) {
		if (!Object.keys(allowedCharacters).includes(character)) return { error: 'Character type not allowed!' };
		verifiedCharacters.push(...allowedCharacters[character]);
	}

	const randomString = [];
	for (let i = 0; i < length; i++) {
		const x = randomIntFromInterval(0, verifiedCharacters.length - 1);
		randomString.push(verifiedCharacters[x]);
	}
	return randomString.toString().replace(/,/g, '');
}

module.exports = ministring;
