/** Scratch Gallery
 * @id exec
 * @name exec
 * @version 1.0.0
 * @description execute javascript code with variables.
 * @tags variables | language
 * @by Tringlyman <https://github.com/Tringlyman>
 * @license MIT
 Scratch Gallery */

(function () {
	"use strict";

	if (!Scratch.extensions.unsandboxed) {
		throw new Error("This extension must be run unsandboxed");
	}
	if (!Scratch.extensions.isPenguinMod) {
		throw "this extension must run in penguinmod";
	}

	Scratch.tringlymanExt = Scratch.tringlymanExt ?? {};

	class GlobalVARS {
		static _vars_ = {};

		static getVars() {
			return this._vars_;
		}

		static addKeyValue(key, value) {
			this._vars_[key] = value;
		}

		static removeKey(key) {
			delete this._vars_[key];
		}

		static clear() {
			this._vars_ = {};
		}
	}

	const EXEC = {
		exec: function (CODE, VARS) {
			const code = `(function(VAR) {
        ${CODE}
        })({
          LOCAL: ${VARS},
          GLOBAL:${JSON.stringify(GlobalVARS._vars_, null, 2)}
        })`;

			/**
			 * `eslint-disable` and `eslint-enable` here is because using 'new Function' is generally discouraged due to security risks,
			 * but in this specific case, it's necessary to achieve the desired functionality of executing dynamic code.
			 */
			/* eslint-disable */
			const EXEC = new Function(`return ${code}`);
			/* eslint-enable */
			return EXEC();
		},
		Argument: {
			shape: Scratch.BlockShape.PLUS,
			check: ["Object", "String"],
			exemptFromNormalization: true,
		},
	};

	class Extension {
		/**
		 * @returns {Scratch.ExtensionType.getInfo}
		 */
		getInfo() {
			return {
				id: "exec",
				name: Scratch.translate("exec"),
				menus: {
					local_global_MENU: {
						acceptReporters: false,
						items: [
							{ text: "local", value: "LOCAL" },
							{ text: "global", value: "GLOBAL" },
						],
					},
				},
				blocks: [
					{
						opcode: "localArgument",
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("Local VAR"),
						hideFromPalette: true,
						canDragDuplicate: true,
					},
					{
						blockType: Scratch.BlockType.LABEL,
						text: Scratch.translate("execute code"),
					},
					{
						opcode: "execCommand",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate(
							"exec [code] with variables [vars][localArgument]"
						),
						arguments: {
							code: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "alert(VAR.LOCAL.foo)",
							},
							vars: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: '{"foo":"bar"}',
								...EXEC.Argument,
							},
							localArgument: {
								fillIn: "localArgument",
							},
						},
					},
					{
						opcode: "execReporter",
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate(
							"exec [code] with variables [vars][localArgument]"
						),
						arguments: {
							code: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "return VAR.LOCAL.foo",
							},
							vars: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: '{"foo":"bar"}',
								...EXEC.Argument,
							},
							localArgument: {
								fillIn: "localArgument",
							},
						},
					},
					{
						opcode: "execBoolean",
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate(
							"exec [code] with variables [vars][localArgument]"
						),
						arguments: {
							code: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "return Boolean(VAR.LOCAL.foo)",
							},
							vars: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: '{"foo":"bar"}',
								...EXEC.Argument,
							},
							localArgument: {
								fillIn: "localArgument",
							},
						},
					},
					"---",
					{
						blockType: Scratch.BlockType.LABEL,
						text: Scratch.translate("variables"),
					},
					{
						opcode: "execVAR",
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("get [local_global] variable [var]", {
							local_global: "local",
							var: "foo",
						}),
						arguments: {
							local_global: {
								type: Scratch.ArgumentType.STRING,
								menu: "local_global_MENU",
							},
							var: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
							},
						},
					},
					{
						opcode: "getGlobalVARS",
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("get all global variables"),
						disableMonitor: true,
					},
					{
						opcode: "addGlobalVAR",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("set global variable [var] to [value]"),
						arguments: {
							var: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
							},
							value: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "bar",
							},
						},
					},
					{
						opcode: "removeGlobalVAR",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("delete global variable [var]"),
						arguments: {
							var: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "foo",
							},
						},
					},
					{
						opcode: "clearGlobalVARS",
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("clear all global variables"),
					},
				],
			};
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		localArgument(args, util) {
			return "VAR.LOCAL";
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		execCommand(args, util) {
			return EXEC.exec(args.code, args.vars);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		execReporter(args, util) {
			return EXEC.exec(args.code, args.vars);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		execBoolean(args, util) {
			const result = EXEC.exec(args.code, args.vars);

			if (String(result) === "true") {
				return true;
			} else if (String(result) === "false") {
				return false;
			} else {
				return;
			}
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		execVAR(args, util) {
			if (args.local_global === "LOCAL") {
				return `VAR.LOCAL[\`${args.var}\`]`;
			}
			return GlobalVARS.getVars()[args.var];
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		getGlobalVARS(args, util) {
			return JSON.stringify(GlobalVARS.getVars(), null, 2);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		addGlobalVAR(args, util) {
			GlobalVARS.addKeyValue(args.var, args.value);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		removeGlobalVAR(args, util) {
			GlobalVARS.removeKey(args.var);
		}

		/**
		 * @type {Scratch.ExtensionType.BlockParam}
		 */
		clearGlobalVARS(args, util) {
			GlobalVARS.clear();
		}
	}

	Scratch.tringlymanExt.exec = new Extension();

	Scratch.extensions.register(Scratch.tringlymanExt.exec);

	Scratch.vm.extensionManager
		.loadExtensionURL(
			"https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js"
		)
		.then(() => {
			console.log("dogeiscutObject loaded successfully");
		})
		.catch((err) => console.error("dogeiscutObject failed to load\n\n", err));
})();
