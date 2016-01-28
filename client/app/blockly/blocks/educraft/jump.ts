export default {
    block: <Blockly.Block> {
        init: function () {
            this.appendDummyInput()
                .appendField("jump");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip('');
            this.setHelpUrl('https://github.com/leMaik/EduCraft/wiki/The-API#jump');
        }
    },
    codeGenerator: function (block:Blockly.Block) {
        switch (block.getFieldValue('direction')) {
            case 'left':
                return 'turnLeft()';
            case 'right':
                return 'turnRight()';
        }
    }
};