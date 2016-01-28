export default {
    block: <Blockly.Block> {
        init: function () {
            this.appendDummyInput()
                .appendField("turn")
                .appendField(new Blockly.FieldDropdown([["left ↺", "left"], ["right ↻", "right"]]), "direction");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip('');
            this.setHelpUrl('https://github.com/leMaik/EduCraft/wiki/The-API#turnleft');
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