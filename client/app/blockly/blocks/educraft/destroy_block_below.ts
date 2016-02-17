export default {
    block: <Blockly.Block> {
        init: function () {
            this.appendDummyInput()
                .appendField("destroy block below");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip('');
            this.setHelpUrl('https://github.com/leMaik/EduCraft/wiki/The-API#destroyblock');
        }
    },
    codeGenerator: () => 'destroyBlock(0, -1)\n'
};