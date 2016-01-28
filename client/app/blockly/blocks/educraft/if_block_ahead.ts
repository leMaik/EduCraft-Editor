export default  {
    block: <Blockly.Block>{
        init: function () {
            this.appendDummyInput()
                .appendField("if")
                .appendField(new Blockly.FieldDropdown([["water", "water"], ["lava", "lava"], ["empty", ""]]), "block")
                .appendField("ahead");
            this.appendStatementInput("body")
                .appendField("do");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(210);
            this.setTooltip('');
            this.setHelpUrl('https://github.com/leMaik/EduCraft/wiki/The-API#ifblockaheadblock-function');
        }
    },
    codeGenerator: function (block:Blockly.Block) {
        var dropdown_block = block.getFieldValue('block');
        var statements_body = Blockly.JavaScript.statementToCode(block, 'body');
        // TODO: Assemble JavaScript into code variable.
        var code = '...';
        return code;
    }
};