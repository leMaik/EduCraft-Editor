import {Component, EventEmitter, Output, Input, OnInit} from 'angular2/core';
import {AceEditor} from './ace';
import {UserService} from "./user.service";
import {BlocklyModule} from "./module";
import {BlocklyArea} from "./blockly/blockly";

const DEFAULT_PROGRAM = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';

@Component({
    selector: 'blockly-editor',
    inputs: ['module'],
    styles: [`
.ui.tab {
    height: calc(100% - 11rem - 10px);
}

[ace-editor] {
    width: 100%;
    height: 100%;
}
`],
    template: `
<div class="ui piled segments" (keydown)="keyDown($event)">
    <div class="ui clearing segment">
        <div class="ui fluid labeled action input">
            <div class="ui basic label">
                {{user.username}}/
            </div>
            <input type="text" placeholder="module-name" [(ngModel)]="name">
            <div class="ui icon button" (click)="save()" [ngClass]="{disabled: !modified}">
                <i class="ui save icon"></i>
            </div>
        </div>
    </div>
    <div class="ui segment">
        <div class="ui secondary pointing menu">
            <div class="item" [ngClass]="{active: tab=='blockly'}" (click)="tab='blockly'">Blockly</div>
            <div class="item" [ngClass]="{active: tab=='code'}" (click)="tab='code'">Code</div>
        </div>
        <div class="ui tab" [ngClass]="{active: tab=='blockly'}">
            <blockly-area (codeChange)="onBlocklyChange($event)" [source]="blockly" *ngIf="tab=='blockly'"></blockly-area>
        </div>
        <div class="ui tab" [ngClass]="{active: tab=='code'}">
            <div ace-editor [content]="code" [readOnly]="true" *ngIf="tab=='code'"></div>
        </div>
    </div>
</div>
`,
    directives: [AceEditor, BlocklyArea],
})
export class BlocklyEditor {
    public user = {};
    public tab = 'blockly';
    private initialName:string;
    private initialBlockly:string = DEFAULT_PROGRAM;
    private name:string;
    private code:string = '';
    private blockly:string = DEFAULT_PROGRAM;
    @Output() moduleSaved:EventEmitter<BlocklyModule> = new EventEmitter();

    constructor(private _userService:UserService) {
        _userService.getUser().subscribe(user => {
            this.user = user;
        });
    }

    save() {
        if (/[0-9A-Za-z\-]+/.test(this.name)) {
            this.moduleSaved.emit({name: this.name, code: this.code, blockly: this.blockly});
            this.initialName = this.name;
            this.initialBlockly = this.blockly;
        } else {
            alert('Only alphanumeric characters are allowed for the module name.');
        }
    }

    keyDown(event) {
        if (event.keyCode == 83 && event.ctrlKey) {
            this.save();
            event.preventDefault();
        }
    }

    onBlocklyChange(event:{code:string,source:string}) {
        let {code, source} = event;
        if (this.code != code) {
            this.code = code;
        }
        if (this.blockly != source) {
            this.blockly = source;
        }
    }

    set module(module:BlocklyModule) {
        this.initialName = module != null ? module.name : '';
        this.initialBlockly = module != null ? module.blockly : DEFAULT_PROGRAM;
        this.name = this.initialName;
        this.blockly = this.initialBlockly;
        this.code = module != null ? module.code : '';

        this.tab = 'blockly';
    }

    get modified() {
        return this.blockly != this.initialBlockly || this.name != this.initialName;
    }
}
