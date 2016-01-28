export default {
    block: <Blockly.Block> {
        init: function () {
            this.appendDummyInput()
                .appendField("move forward");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip('');
            this.setHelpUrl('https://github.com/leMaik/EduCraft/wiki/The-API#moveforward');
        }
    },
    codeGenerator: function (block:Blockly.Block) {
        return
    }
};