export default {
    block: <Blockly.Block> {
        init: function () {
            this.appendDummyInput()
                .appendField("attack");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip('');
            this.setHelpUrl('https://github.com/leMaik/EduCraft/wiki/The-API#shear');
        }
    },
    codeGenerator: () => 'attack();\n'
};