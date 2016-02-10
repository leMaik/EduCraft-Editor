import blocks from './block_types'

export default {
    block: <Blockly.Block> {
        init: function () {
            this.appendDummyInput()
                .appendField("place")
                .appendField(new Blockly.FieldDropdown(blocks), "block");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip('');
            this.setHelpUrl('https://github.com/leMaik/EduCraft/wiki/The-API#placeblockblock');
        }
    },
    codeGenerator: function (block:Blockly.Block) {
        let blockType = block.getFieldValue('block');
        return 'placeBlock("' + blockType + '")\n';
    }
};