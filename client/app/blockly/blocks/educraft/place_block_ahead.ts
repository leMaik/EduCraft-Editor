import blocks from './block_types'

export default {
    block: <Blockly.Block> {
        init: function () {
            this.appendDummyInput()
                .appendField("place")
                .appendField(new Blockly.FieldDropdown(blocks), "block")
                .appendField("ahead");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(120);
            this.setTooltip('');
            this.setHelpUrl('https://github.com/leMaik/EduCraft/wiki/The-API#placeblockaheadblock');
        }
    },
    codeGenerator: function (block:Blockly.Block) {

    }
};