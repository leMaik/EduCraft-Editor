/// <reference path="../../typings/blockly/blockly-core.d.ts" />

import {ElementRef, Component, EventEmitter, Output, AfterViewInit} from 'angular2/core';
import 'blockly'
import LuaGenerator from './lua'
import ProgramBaseBlock from './blocks/program_base'
import RepeatBlock from './blocks/repeat'
import EduCraftBlocks from './blocks/educraft/educraft'

Blockly.Lua = LuaGenerator; //TODO refactor this so that Blockly doesn't need to be changed

Blockly.Blocks['program_base'] = ProgramBaseBlock.block;
LuaGenerator['program_base'] = ProgramBaseBlock.codeGenerator;
Blockly.Blocks['repeat'] = RepeatBlock.block;
LuaGenerator['repeat'] = RepeatBlock.codeGenerator;

for (let name of Object.keys(EduCraftBlocks)) {
    Blockly.Blocks[name] = EduCraftBlocks[name].block;
    LuaGenerator[name] = EduCraftBlocks[name].codeGenerator;
}

@Component({
    selector: 'blockly-area',
    inputs: ['content'],
    outputs: ['contentChange: change'],
    template: `
<div class="editor" style="height: 500px"></div>
<xml class="toolbox" style="display: none">
    <category name="Moving">
      <block type="move_forward"></block>
      <block type="turn">
        <field name="direction">left</field>
      </block>
      <block type="turn">
        <field name="direction">right</field>
      </block>
      <block type="jump"></block>
    </category>
    <category name="Actions">
      <block type="place_block"></block>
      <block type="place_block_ahead"></block>
      <block type="destroy_block"></block>
      <block type="place_torch"></block>
      <block type="plant_crop"></block>
      <block type="shear"></block>
      <block type="attack"></block>
    </category>
    <category name="Loops &amp; Logic">
      <block type="repeat"></block>
      <block type="if_block_ahead"></block>
    </category>
</xml>
`
})
export class BlocklyArea implements AfterViewInit {
    private blockly;
    private element:HTMLElement;

    @Output() contentChange:EventEmitter<string> = new EventEmitter();

    constructor(elementRef:ElementRef) {
        this.element = <HTMLElement>elementRef.nativeElement;
    }

    ngAfterViewInit():any {
        this.blockly = Blockly.inject(this.element.querySelector('.editor'), {
            toolbox: this.element.querySelector('.toolbox'),
            scrollbars: true
        });
        this.blockly.addChangeListener(() => console.log(this.code));

        var xml = '<xml><block type="program_base" deletable="false" movable="false"></block></xml>';
        Blockly.Xml.domToWorkspace(this.blockly, Blockly.Xml.textToDom(xml));
    }

    get code() {
        return LuaGenerator.workspaceToCode(this.blockly);
    }
}