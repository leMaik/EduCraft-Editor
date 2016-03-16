export default  {
    block: {
        init: function () {
            this.appendDummyInput()
                .appendField("repeat")
                .appendField(new Blockly.FieldTextInput(2, (text) => {
                    if (text === null) {
                        return null;
                    }
                    text = String(text).replace(/O/ig, '0').replace(/,/g, '');
                    let n = parseFloat(text || 0);
                    if (isNaN(n) || n < 1) {
                        return null;
                    }
                    return String(n);
                }), "n")
                .appendField("times");
            this.appendStatementInput("body")
                .appendField("do");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip('');
        }
    },
    codeGenerator: function (block:Blockly.Block) {
        let repeats = parseInt(block.getFieldValue('n'), 10);
        let branch = Blockly.Lua.statementToCode(block, 'body') || '';
        let loopVar = Blockly.Lua.variableDB_.getDistinctName('count', Blockly.Variables.NAME_TYPE);
        return 'for ' + loopVar + '=1,' + repeats + ' do\n' + branch + 'end\n';
    }
}