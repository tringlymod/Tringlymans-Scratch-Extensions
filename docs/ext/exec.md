# exec Extension

exec is an extension that aims on the similar purpose of JavaScriptV2 extension in [penguinmod's](https://studio.penguinmod.com/editor.html) extensions gallery of **exec**uting javasccript code directly through [penguinmod](https://studio.penguinmod.com/editor.html)

## blocks

there are 3 major blocks:

1. command - executes the JS code
2. reporter - returns the JS result if it returns smth in the end
3. boolean - same as reporter but returns a only if the return value is `true` or `false`

## variable system

variable system has to parts:

1. local - locally on the block and accessable through the `VAR.LOCAL` object
2. global - globally for all blocks and accessable through the `VAR.GLOBAL` object

### local

local variables are a block exclusive object that is the purpose of the second argument

### global

global variables are an object that is handled by a class inside of the extension that is handled by external blocks which are:

1. creating the `key - value` pairs for the global object to get the value from
2. delete a specific `key - value` pair from the global object
3. delete all the `key - value` pairs from the global object

there are also 2 reporters that return a string used to get a specific local/global key's value and another one to get the local/global object
