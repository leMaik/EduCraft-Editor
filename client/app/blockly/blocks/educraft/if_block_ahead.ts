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
        let blockType = block.getFieldValue('block');
        let branch = Blockly.Lua.statementToCode(block, 'body') || '';
        return 'ifBlockAhead("' + blockType + '", function()\n' + branch + 'end)\n';
    }
};