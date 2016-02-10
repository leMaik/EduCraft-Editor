/// <reference path="../../typings/blockly/blockly-core.d.ts" />

import {ElementRef, Component, EventEmitter, Output, AfterViewInit, OnDestroy} from 'angular2/core';
import 'blockly'
import LuaGenerator from './lua'
import ProgramBaseBlock from './blocks/program_base'
import RepeatBlock from './blocks/repeat'
import EduCraftBlocks from './blocks/educraft/educraft'

Blockly['Lua'] = LuaGenerator; //TODO refactor this so that Blockly doesn't need to be changed

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
    inputs: ['source'],
    outputs: ['codeChange: change'],
    template: `
<div class="editor" style="height:100%"></div>
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
export class BlocklyArea implements AfterViewInit, OnDestroy {
    private blockly;
    private element:HTMLElement;
    private _source:string;

    @Output() codeChange:EventEmitter<{code:string,source:string}> = new EventEmitter();

    constructor(elementRef:ElementRef) {
        this.element = <HTMLElement>elementRef.nativeElement;
    }

    ngAfterViewInit() {
        this.blockly = Blockly.inject(this.element.querySelector('.editor'), {
            toolbox: this.element.querySelector('.toolbox'),
            scrollbars: true
        });
        Blockly.svgResize(this.blockly); //prevent editor from flickering
        this.blockly.addChangeListener(() => {
            this._source = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.blockly));
            this.codeChange.emit({
                code: LuaGenerator.workspaceToCode(this.blockly),
                source: this._source
            });
        });

        if (this._source != null) {
            this.blockly.clear();
            Blockly.Xml.domToWorkspace(this.blockly, Blockly.Xml.textToDom(this._source));
        }
    }

    ngOnDestroy() {
        this.blockly.dispose();

        //Blockly re-uses the following elements and thus doesn't remove them
        Blockly.WidgetDiv.DIV.remove();
        Blockly.WidgetDiv.DIV = null;
        Blockly.Tooltip.DIV.remove();
        Blockly.Tooltip.DIV = null;
    }

    set source(content:string) {
        if (content != this._source) {
            if (this.blockly != null) {
                this.blockly.clear();
                Blockly.Xml.domToWorkspace(this.blockly, Blockly.Xml.textToDom(content));
            }
            this._source = content;
        }
    }
}