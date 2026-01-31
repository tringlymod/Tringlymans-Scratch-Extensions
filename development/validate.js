const Builder = require("./builder");
const Colors = require("./colors");

const builder = new Builder("production");
const { warns, errors } = builder.validate();

function warnings() {
	if (warns.length > 0) {
		let biggestWarningLength = 0;
		const warningList = [
			`${Colors.ORANGE}${Colors.BOLD}${warns.length} ${warns.length === 1 ? "file" : "files"} generated warnings during validation.${Colors.RESET}\n`,
		];

		for (const { fileName, error } of warns) {
			if (!error) continue;
			if (error.length > biggestWarningLength) {
				biggestWarningLength = error.length;
			}
			warningList.push(`${Colors.BOLD}${fileName}${Colors.RESET}: ${error}`);
		}
		console.warn(``.padEnd(biggestWarningLength, "-"));
		console.warn(warningList.join("\n"));
	}
}
if (errors.length === 0) {
	console.log("");
	console.log(
		`${Colors.GREEN}${Colors.BOLD}Validation checks passed.${Colors.RESET}`
	);
	warnings();
	process.exit(0);
} else {
	console.error("");
	console.error(
		`${Colors.RED}${Colors.BOLD}${errors.length} ${
			errors.length === 1 ? "file" : "files"
		} failed validation.${Colors.RESET}`
	);
	console.error("");
	for (const { fileName, error } of errors) {
		console.error(`${Colors.BOLD}${fileName}${Colors.RESET}: ${error}`);
	}
	console.error(``);
	warnings();
	process.exit(1);
}
