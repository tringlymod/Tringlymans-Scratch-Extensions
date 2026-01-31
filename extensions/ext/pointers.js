/** Scratch Gallery
 * @id pointers
 * @name pointers
 * @version 1.0.0
 * @by tringlyman <https://github.com/tringlyman>
 * @description pointers like C.
 * @tags variables | address
 * @license MIT
 * @unknownBg #7222cc
 Scratch Gallery */

(function () {
	"use strict";

	Scratch.tringlymanExt = Scratch.tringlymanExt ?? {};

	const defaultPointer = (function () {
		const text = "none";
		return {
			text,
			value: `${text}${Math.random().toString().substring(2)}`,
		};
	})();

	class Extension {
		static pointers = new Map();

		/**
		 * @returns {Scratch.ExtensionType.getInfo}
		 */
		getInfo() {
			return {
				id: "pointers",
				name: Scratch.translate("pointers"),
				color1: "#7222cc",
				isDynamic: true,
				menus: {
					pointers: {
						acceptReporters: true,
						items: "pointers",
					},
					getAllType: {
						acceptReporters: false,
						items: ["compact", "pretty"],
					},
					name_data: {
						acceptReporters: false,
						items: ["name", "data"],
					},
				},
				blocks: [
					{
						opcode: "pointersMenu",
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[pointer]"),
						arguments: {
							pointer: {
								type: Scratch.ArgumentType.STRING,
								menu: "pointers",
							},
						},
						disableMonitor: true,
					},
					{
						opcode: "getAll",
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("get all pointers as [getAllType]"),
						arguments: {
							getAllType: {
								type: Scratch.ArgumentType.STRING,
								menu: "getAllType",
							},
						},
						disableMonitor: true,
					},
					"---",
					{
						opcode: "set",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("set pointer [name] to [data]"),
						arguments: {
							name: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "p",
							},
							data: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "pointer",
							},
						},
					},
					{
						opcode: "setAddress",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate(
							"set address of pointer [name] to [address]"
						),
						arguments: {
							name: {
								type: Scratch.ArgumentType.STRING,
								menu: "pointers",
							},
							address: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: "0",
							},
						},
					},
					{
						opcode: "delete",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("delete pointer [name]"),
						arguments: {
							name: {
								type: Scratch.ArgumentType.STRING,
								menu: "pointers",
							},
						},
					},
					{
						opcode: "deleteAll",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("delete all pointers"),
					},
					"---",
					{
						opcode: "getAddress",
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("get address of pointer [name]"),
						arguments: {
							name: {
								type: Scratch.ArgumentType.STRING,
								menu: "pointers",
							},
						},
						forceOutputType: "pointerAddress",
					},
					{
						opcode: "get",
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate(
							"get [name_data] of pointer with address [address]"
						),
						arguments: {
							address: {
								type: Scratch.ArgumentType.NUMBER,
								check: ["pointerAddress", "Number"],
							},
							name_data: {
								type: Scratch.ArgumentType.STRING,
								menu: "name_data",
								defaultValue: "data",
							},
						},
					},
					"---",
					{
						opcode: "exist",
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("does [name] exist?"),
						arguments: {
							name: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "p",
							},
						},
					},
				],
			};
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		pointers(args, util) {
			const pointers = Object.keys(
				Object.fromEntries(
					Object.entries(
						Object.fromEntries(Extension.pointers.entries())
					).filter(([key, value]) => isNaN(Number(key)))
				)
			);

			return pointers.length < 1
				? [defaultPointer]
				: [
						defaultPointer,
						...pointers.map((pointer) => ({ text: pointer, value: pointer })),
					];
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		pointersMenu(args, util) {
			return args.pointer === defaultPointer.value ? undefined : args.pointer;
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		getAll(args, util) {
			const obj = Object.fromEntries(
				Object.entries(Object.fromEntries(Extension.pointers.entries())).filter(
					([key, value]) => isNaN(Number(key))
				)
			);

			if (args.getAllType === "compact") return JSON.stringify(obj);
			if (args.getAllType === "pretty") return JSON.stringify(obj, null, 2);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		set(args, util) {
			if (
				args.name === defaultPointer.value ||
				args.name === defaultPointer.text
			)
				return;
			const name = args.name;
			const data = args.data;
			const address = Scratch.Cast.toNumber(
				!Extension.pointers.has(name)
					? Math.random().toString().substring(2)
					: Extension.pointers.get(name).address
			);
			Extension.pointers.set(name, {
				address,
				data,
			});
			Extension.pointers.set(address, {
				name,
				data,
			});
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		setAddress(args, util) {
			if (
				args.name === defaultPointer.value ||
				args.name === defaultPointer.text
			)
				return;
			if (Extension.pointers.has(args.name)) {
				const name = args.name;
				const address = args.address;
				const data = Extension.pointers.get(name).data;
				const oldName = Extension.pointers.get(name);
				Extension.pointers.delete(name);
				Extension.pointers.set(name, {
					address,
					data,
				});
				Extension.pointers.delete(oldName.address);
				Extension.pointers.set(address, {
					name,
					data,
				});
				return;
			}
			throw `Pointer "${args.name}" does not exist!`;
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		delete(args, util) {
			if (
				args.name === defaultPointer.value ||
				args.name === defaultPointer.text
			)
				return;
			const name = !isNaN(args.name)
				? Scratch.Cast.toNumber(args.name)
				: args.name;
			if (Extension.pointers.has(name)) {
				Extension.pointers.delete(
					Extension.pointers.get(name)[
						typeof name === "number" ? "name" : "address"
					]
				);
				Extension.pointers.delete(name);
				return;
			}
			throw `Pointer "${args.name}" does not exist!`;
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		deleteAll(args, util) {
			Extension.pointers = new Map();
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		getAddress(args, util) {
			if (
				args.name === defaultPointer.value ||
				args.name === defaultPointer.text
			)
				return;
			if (Extension.pointers.has(args.name)) {
				const pointer = Extension.pointers.get(args.name);
				return pointer.address;
			}
			throw `Pointer "${args.name}" does not exist!`;
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		get(args, util) {
			if (Extension.pointers.has(args.address)) {
				return Object.fromEntries(Extension.pointers.entries())[
					Scratch.Cast.toString(args.address)
				][args.name_data];
			}
			throw `Address "${args.address}" does not exist!`;
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		exist(args, util) {
			const name = !isNaN(args.name)
				? Scratch.Cast.toNumber(args.name)
				: args.name;
			return Extension.pointers.has(
				Extension.pointers.get(name)?.[
					typeof name === "number" ? "name" : "address"
				] ?? name
			);
		}
	}

	Scratch.tringlymanExt.pointers = new Extension();

	Scratch.extensions.register(Scratch.tringlymanExt.pointers);
})();
