import { FLICKER_PATTERN_SIZE } from "./constants";

const morseCode = {
	A: ".-",
	B: "-...",
	C: "-.-.",
	D: "-..",
	E: ".",
	F: "..-.",
	G: "--.",
	H: "....",
	I: "..",
	J: ".---",
	K: "-.-",
	L: ".-..",
	M: "--",
	N: "-.",
	O: "---",
	P: ".--.",
	Q: "--.-",
	R: ".-.",
	S: "...",
	T: "-",
	U: "..-",
	W: ".--",
	X: "-..-",
	Y: "-.--",
	Z: "--..",
	" ": " ",
};
export const convertToMorse = (str) => {
	return str
		.toUpperCase()
		.split("")
		.map((el) => {
			//return morseCode[el] ? morseCode[el] : el;
			return morseCode[el];
		})
		.filter((el) => el !== undefined)
		.join("");
};

console.log(convertToMorse("Disaster management"));
console.log(convertToMorse("hey there!"));

const morseToFlickerPattern = {
	".": [true, false],
	"-": [true, true, false],
	" ": [false, false],
};

export const convertMorseToFlickerPattern = (str) => {
	const flickerPattern = [];
	[...str].forEach((c) => {
		const characterFlickerPattern = morseToFlickerPattern[c];
		flickerPattern.push(...characterFlickerPattern);
	});

	return flickerPattern;
};

export const convertStringToMorseFlickerPattern = (str) => {
	const fullMorseCodeFlickerPattern = convertMorseToFlickerPattern(
		convertToMorse(str)
	);
	console.log("original length ", fullMorseCodeFlickerPattern.length);

	const slicedFlickerPattern = fullMorseCodeFlickerPattern.slice(
		0,
		FLICKER_PATTERN_SIZE
	);
	console.log("slicedFlickerPattern length ", slicedFlickerPattern.length);

	return slicedFlickerPattern;
};

export const getFlickerPatternDistance = (a, b) => {
	let difference = 0;
	for (let i = 0; i < FLICKER_PATTERN_SIZE; i++) {
		if (a[i] !== b[i]) difference += 1;
	}
	return difference;
};
