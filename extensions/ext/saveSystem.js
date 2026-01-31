/** Scratch Gallery
 * @id saveSystem
 * @name save system
 * @version 1.0.0
 * @description a save system that allows you to create, read, update and delete saves and slots.
 * @tags variables
 * @by Tringlyman <https://github.com/tringlyman>
 * @license MIT
 * @unknownBg #FFA500
 Scratch Gallery */

(function () {
	"use strict";

	/**
	 * prevents extension to load and throws the reason due to sandbox limitations
	 */
	if (!Scratch.extensions.unsandboxed) {
		throw new Error("this extension must run unsandboxed");
	}
	if (!Scratch.extensions.isPenguinMod) {
		throw "this extension must run in penguinmod";
	}

	Scratch.tringlymanExt = Scratch.tringlymanExt ?? {};

	class Saves {
		saves = {};

		setSave(key, value = "{}") {
			this.saves[key] = JSON.parse(value);
		}

		deleteSave(save) {
			delete this.saves[save];
		}

		readSave(save) {
			try {
				return JSON.stringify(this.saves[save], null, 2);
			} catch (e) {
				return;
			}
		}

		setSlot(save, key, value = "") {
			try {
				this.saves[save][key] = value;
			} catch (e) {
				return;
			}
		}

		deleteSlot(save, key) {
			try {
				delete this.saves[save][key];
			} catch (e) {
				return;
			}
		}

		readSlot(save, key) {
			try {
				return this.saves[save][key];
			} catch (e) {
				return;
			}
		}

		emptySaveSystem() {
			this.saves = {};
		}

		readSaveSystem() {
			return JSON.stringify(this.saves, null, 2);
		}
	}

	const system = new Saves();

	class Extension {
		/**
		 *
		 * @returns {Scratch.ExtensionType.getInfo}
		 */
		getInfo() {
			return {
				id: "saveSystem",
				name: Scratch.translate("save system"),
				color1: "#FFA500",
				color2: "#E69500",
				color3: "#CC8500",
				menus: {},
				blocks: [
					{
						blockType: Scratch.BlockType.LABEL,
						text: Scratch.translate("saves"),
					},
					{
						opcode: "createBlankSave",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("create blank save [saveName]"),
						arguments: {
							saveName: {
								type: Scratch.ArgumentType.STRING,
								shape: Scratch.BlockShape.SQUARE,
								defaultValue: "saveName",
							},
						},
					},
					{
						opcode: "setSave",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("set save [saveName]:[saveValue]"),
						arguments: {
							saveName: {
								type: Scratch.ArgumentType.STRING,
								shape: Scratch.BlockShape.SQUARE,
								defaultValue: "saveName",
							},
							saveValue: {
								type: Scratch.ArgumentType.STRING,
								shape: Scratch.BlockShape.SQUARE,
								defaultValue: '{"slotName":"slotValue"}',
							},
						},
					},
					{
						opcode: "deleteSave",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("delete save [save]"),
						arguments: {
							save: {
								type: Scratch.ArgumentType.STRING,
								shape: Scratch.BlockShape.SQUARE,
								defaultValue: "saveName",
							},
						},
					},
					{
						opcode: "readSave",
						blockType: Scratch.BlockType.REPORTER,
						blockShape: Scratch.BlockShape.PLUS,
						text: Scratch.translate("read save [save]"),
						arguments: {
							save: {
								type: Scratch.ArgumentType.STRING,
								shape: Scratch.BlockShape.SQUARE,
								defaultValue: "saveName",
							},
						},
						disableMonitor: true,
					},
					"---",
					{
						blockType: Scratch.BlockType.LABEL,
						text: Scratch.translate("slots"),
					},
					{
						opcode: "setSlot",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("[save] set slot [slotName]:[slotValue]"),
						arguments: {
							save: {
								type: Scratch.ArgumentType.STRING,
								shape: Scratch.BlockShape.SQUARE,
								defaultValue: "saveName",
							},
							slotName: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "slotName",
							},
							slotValue: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "slotValue",
							},
						},
					},
					{
						opcode: "deleteSlot",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("[save] delete slot [slotName]"),
						arguments: {
							save: {
								type: Scratch.ArgumentType.STRING,
								shape: Scratch.BlockShape.SQUARE,
								defaultValue: "saveName",
							},
							slotName: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "slotName",
							},
						},
					},
					{
						opcode: "readSlot",
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[save] read slot [slotName]"),
						arguments: {
							save: {
								type: Scratch.ArgumentType.STRING,
								shape: Scratch.BlockShape.SQUARE,
								defaultValue: "saveName",
							},
							slotName: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "slotName",
							},
						},
						disableMonitor: true,
					},
					"---",
					{
						blockType: Scratch.BlockType.LABEL,
						text: Scratch.translate("save system"),
					},
					{
						opcode: "emptySaveSystem",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("empty save system"),
					},
					{
						opcode: "readSaveSystem",
						blockType: Scratch.BlockType.REPORTER,
						blockShape: Scratch.BlockShape.PLUS,
						text: Scratch.translate("read save system"),
						disableMonitor: true,
					},
				],
			};
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		createBlankSave(args, util) {
			system.setSave(args.saveName);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		setSave(args, util) {
			system.setSave(args.saveName, args.saveValue);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		deleteSave(args, util) {
			system.deleteSave(args.save);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		readSave(args, util) {
			return system.readSave(args.save);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		setSlot(args, util) {
			system.setSlot(args.save, args.slotName, args.slotValue);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		deleteSlot(args, util) {
			system.deleteSlot(args.save, args.slotName);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		readSlot(args, util) {
			return system.readSlot(args.save, args.slotName);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		emptySaveSystem(args, util) {
			system.emptySaveSystem();
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		readSaveSystem(args, util) {
			return system.readSaveSystem();
		}
	}

	Scratch.tringlymanExt.saveSystem = new Extension();
	Scratch.extensions.register(Scratch.tringlymanExt.saveSystem);
})();
