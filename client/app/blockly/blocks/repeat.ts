export default  {
    block: {
        init: function () {
            this.appendDummyInput()
                .appendField("repeat")
                .appendField(new Blockly.FieldDropdown([["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"]]), "n")
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