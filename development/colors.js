const enableColor = !process.env.NO_COLOR;
const color = (i) => (enableColor ? i : "");

module.exports = {
	RESET: color("\x1b[0m"),
	BOLD: color("\x1b[1m"),
	RED: color("\x1b[31m"),
	YELLOW: color("\x1b[33m"),
	ORANGE: color("\x1b[38;5;208m"),
	GREEN: color("\x1b[32m"),
};
