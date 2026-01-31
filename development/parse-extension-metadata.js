const ExtendedJSON = require("@turbowarp/json");

class Person {
	constructor(name, link) {
		/** @type {string} */
		this.name = name;
		/** @type {string|null} */
		this.link = link;
	}

	toHTML() {
		// Don't need to bother escaping here. There's no vulnerability.
		if (this.link) {
			return `<a href="${this.link}">${this.name}</a>`;
		}
		return this.name;
	}
}

class Extension {
	constructor() {
		this.id = "";
		this.name = "";
		this.version = "";
		this.description = "";
		this.tags = [];
		this.license = "";
		/** @type {Person[]} */
		this.by = [];
		/** @type {Person[]} */
		this.original = [];
		this.context = "";
		this.scratchCompatible = false;
		this.readonly = "true";
		this.unknownBg = "#0fbd8c";
	}
}

/**
 * @param {string} string
 * @param {string} split
 * @returns {string[]}
 */
const splitFirst = (string, split) => {
	const idx = string.indexOf(split);
	if (idx === -1) {
		return [string];
	}
	return [string.substring(0, idx), string.substring(idx + split.length)];
};

/**
 * @param {string} person
 * @returns {Person}
 */
const parsePerson = (person) => {
	const parts = splitFirst(person, "<");
	if (parts.length === 1) {
		return new Person(person, null);
	}

	const name = parts[0].trim();
	const link = parts[1].replace(">", "");
	return new Person(name, link);
};

function getMetadata(line, metadata) {
	const withoutComment = line.substring(2).trim();
	const parts = splitFirst(
		withoutComment,
		withoutComment.startsWith("@") ? " " : ":"
	);

	const key = (parts[0].startsWith("@") ? parts[0].substring(1) : parts[0])
		.toLowerCase()
		.trim();
	const value = parts[1]?.trim();

	switch (key) {
		case "id":
			metadata.id = value;
			break;
		case "name":
			metadata.name = value;
			break;
		case "version":
			metadata.version = value;
			break;
		case "description":
			metadata.description = value;
			break;
		case "tags":
			metadata.tags = ExtendedJSON.parse(
				(function () {
					const result = [];
					value.split(" | ").forEach((tag) => result.push(tag));
					return ExtendedJSON.stringify(result);
				})()
			);
			break;
		case "license":
			metadata.license = value;
			break;
		case "by":
			metadata.by.push(parsePerson(value));
			break;
		case "original":
			metadata.original.push(parsePerson(value));
			break;
		case "context":
			metadata.context = value;
			break;
		case "scratch-compatible":
			metadata.scratchCompatible = value === "true";
			break;
		case "readonly":
			metadata.readonly = value;
			break;
		case "unknownbg":
			metadata.unknownBg = new RegExp(
				/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/
			).test(value)
				? value
				: "#0fbd8c";
			break;
		default:
			// TODO
			break;
	}
}

/**
 * @param {string} extensionCode
 * @return {Extension}
 */
const parseMetadata = (extensionCode) => {
	const metadata = new Extension();

	const multiline = {
		start: "/** Scratch Gallery",
		end: "Scratch Gallery */",
	};

	if (
		extensionCode.includes(multiline.start) &&
		extensionCode.includes(multiline.end)
	) {
		for (const line of extensionCode
			.substring(
				extensionCode.indexOf(multiline.start + 1),
				extensionCode.indexOf(multiline.end) + 1
			)
			.split("\n")) {
			getMetadata(line, metadata);
		}
	} else {
		for (const line of extensionCode.split("\n")) {
			if (!line.startsWith("//")) {
				// End of header.
				break;
			}

			getMetadata(line, metadata);
		}
	}

	return metadata;
};

module.exports = parseMetadata;
