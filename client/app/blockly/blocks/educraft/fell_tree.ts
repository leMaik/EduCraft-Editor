export default {
    block: <Blockly.Block> {
        init: function () {
            this.appendDummyInput()
                .appendField("fell tree");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip('');
            this.setHelpUrl('https://github.com/leMaik/EduCraft/wiki/The-API#felltree');
        }
    },
    codeGenerator: () => 'fellTree()\n'
};