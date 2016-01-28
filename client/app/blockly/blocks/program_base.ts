export default {
    init: function () {
        this.appendDummyInput()
            .appendField("when run");
        this.setInputsInline(true);
        this.setNextStatement(true, null);
        this.setColour(60);
        this.setTooltip('');
    }
};